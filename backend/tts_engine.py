"""
TTS Audio Engine for Saudi / Gulf Cafe Content
Free Default: Edge-TTS (ar-SA-HamedNeural, ar-SA-ZariyahNeural)
Paid Option: ElevenLabs (Multilingual v2)
Includes automatic fallback and character quota tracking.
"""

import os
import asyncio
import subprocess
import requests
from typing import Dict, Any, Optional
from quota_tracker import QuotaTracker

# Edge-TTS Saudi voices
SAUDI_VOICE_MALE = "ar-SA-HamedNeural"
SAUDI_VOICE_FEMALE = "ar-SA-ZariyahNeural"

class TTSEngine:
    def __init__(self, elevenlabs_api_key: Optional[str] = None):
        self.elevenlabs_api_key = elevenlabs_api_key or os.environ.get("ELEVENLABS_API_KEY")
        self.tracker = QuotaTracker()

    def generate_speech(
        self,
        text: str,
        output_path: str,
        voice_gender: str = "male",
        engine_mode: str = "free",  # "free" or "paid"
        job_id: str = None
    ) -> Dict[str, Any]:
        """
        Generates audio file from text.
        engine_mode: "free" (Edge-TTS) or "paid" (ElevenLabs)
        """
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        char_count = len(text)

        # Check quota if paid requested
        if engine_mode == "paid":
            if not self.elevenlabs_api_key:
                print("[TTSEngine] No ElevenLabs API key found. Falling back to Edge-TTS (Free).")
                return self._generate_edge_tts(text, output_path, voice_gender, job_id, fallback_reason="No ElevenLabs key configured")
            
            quota_status = self.tracker.get_service_usage("elevenlabs_monthly_chars")
            if quota_status["is_exhausted"] or (quota_status["remaining"] < char_count):
                print(f"[TTSEngine] ElevenLabs quota exhausted (remaining: {quota_status['remaining']}). Auto-falling back to Edge-TTS!")
                return self._generate_edge_tts(text, output_path, voice_gender, job_id, fallback_reason="ElevenLabs monthly quota reached")

            try:
                return self._generate_elevenlabs(text, output_path, job_id)
            except Exception as e:
                print(f"[TTSEngine] ElevenLabs failed ({e}). Auto-falling back to Edge-TTS!")
                return self._generate_edge_tts(text, output_path, voice_gender, job_id, fallback_reason=f"ElevenLabs error: {str(e)}")

        # Free mode (Edge-TTS)
        return self._generate_edge_tts(text, output_path, voice_gender, job_id)

    def _generate_edge_tts(
        self,
        text: str,
        output_path: str,
        voice_gender: str = "male",
        job_id: str = None,
        fallback_reason: str = None
    ) -> Dict[str, Any]:
        voice = SAUDI_VOICE_MALE if voice_gender == "male" else SAUDI_VOICE_FEMALE
        
        # Async run edge-tts
        async def _run():
            import edge_tts
            communicate = edge_tts.Communicate(text, voice, rate="+5%", pitch="+0Hz")
            await communicate.save(output_path)

        asyncio.run(_run())
        
        duration = self._get_audio_duration(output_path)
        self.tracker.record_usage("edge_tts_chars", len(text), job_id)

        return {
            "success": True,
            "engine": "edge_tts",
            "voice": voice,
            "characters": len(text),
            "duration_seconds": round(duration, 2),
            "output_path": output_path,
            "fallback_used": fallback_reason is not None,
            "fallback_reason": fallback_reason
        }

    def _generate_elevenlabs(self, text: str, output_path: str, job_id: str = None) -> Dict[str, Any]:
        # Default Arabic/multilingual voice id
        voice_id = os.environ.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Rachel or Custom Arabic voice
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "xi-api-key": self.elevenlabs_api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.45,
                "similarity_boost": 0.8
            }
        }
        res = requests.post(url, headers=headers, json=payload, timeout=20)
        res.raise_for_status()

        with open(output_path, "wb") as f:
            f.write(res.content)

        duration = self._get_audio_duration(output_path)
        self.tracker.record_usage("elevenlabs_monthly_chars", len(text), job_id)

        return {
            "success": True,
            "engine": "elevenlabs",
            "voice": voice_id,
            "characters": len(text),
            "duration_seconds": round(duration, 2),
            "output_path": output_path,
            "fallback_used": False,
            "fallback_reason": None
        }

    def _get_audio_duration(self, audio_file: str) -> float:
        try:
            cmd = [
                "ffprobe", "-v", "error", "-show_entries",
                "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
                audio_file
            ]
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
            return float(res.stdout.strip())
        except Exception:
            # Fallback estimation: ~13 chars per second
            return 14.0

if __name__ == "__main__":
    engine = TTSEngine()
    sample_text = "يا ساتر على الروقان! هالمشروب يسرسح على القلب ويعدل مزاجك الحين بـ كافيه الرياض."
    out = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/test_tts.mp3"
    result = engine.generate_speech(sample_text, out, voice_gender="male", engine_mode="free")
    print(result)
