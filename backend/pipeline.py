"""
Complete Phase 1 End-to-End Content Production Pipeline
Executes the full pipeline with automatic retries and fallback mechanisms.
"""

import os
import time
import uuid
from typing import List, Dict, Any, Optional
from job_manager import JobManager
from script_generator import ScriptGenerator
from tts_engine import TTSEngine
from ken_burns import KenBurnsGenerator
from video_assembler import VideoAssembler
from quota_tracker import QuotaTracker

OUTPUT_DIR = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/output")

class ProductionPipeline:
    def __init__(self):
        self.job_manager = JobManager()
        self.script_gen = ScriptGenerator()
        self.tts = TTSEngine()
        self.ken_burns = KenBurnsGenerator()
        self.assembler = VideoAssembler()
        self.tracker = QuotaTracker()
        os.makedirs(OUTPUT_DIR, exist_ok=True)

    def process_job(
        self,
        image_paths: List[str],
        user_caption: Optional[str] = "",
        style: str = "مرِح",
        telegram_chat_id: Optional[str] = None,
        cafe_id: str = "cafe-default-01",
        engine_mode: str = "free",  # "free" or "paid"
        simulate_error: bool = False,
        job_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Runs the full Phase 1 production pipeline.
        Handles retry (up to 2 times) and fallback automatically.
        """
        job_id = job_id or f"job_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        job_folder = os.path.join(OUTPUT_DIR, job_id)
        os.makedirs(job_folder, exist_ok=True)

        # 1. Received
        self.job_manager.create_job(job_id, image_paths, user_caption, style, telegram_chat_id, cafe_id)
        print(f"[{job_id}] 📥 Step 1/6: Job received ({len(image_paths)} images, style: {style})")

        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                if simulate_error and attempt < 2:
                    raise RuntimeError(f"Simulated cloud timeout error (attempt {attempt+1})")

                # 2. Scripting
                self.job_manager.update_status(job_id, "scripting")
                print(f"[{job_id}] ✍️ Step 2/6: Generating Saudi youth script...")
                script_data = self.script_gen.generate(user_caption, style, cafe_name="كافيه الرياض")
                self.tracker.record_usage("gemini_daily_requests", 1, job_id)

                # 3. Voice (TTS)
                self.job_manager.update_status(job_id, "voice", script_data=script_data)
                print(f"[{job_id}] 🎙️ Step 3/6: Synthesizing Arabic voiceover...")
                audio_path = os.path.join(job_folder, "voiceover.mp3")
                tts_result = self.tts.generate_speech(
                    text=script_data["voiceover_text"],
                    output_path=audio_path,
                    voice_gender="male",
                    engine_mode=engine_mode,
                    job_id=job_id
                )
                actual_duration = tts_result["duration_seconds"]

                # 4. Video (Ken Burns / Motion clips)
                self.job_manager.update_status(job_id, "video")
                print(f"[{job_id}] 🎬 Step 4/6: Creating 9:16 Ken Burns motion clips...")
                base_video_path = os.path.join(job_folder, "base_motion.mp4")
                self.ken_burns.generate_montage(
                    image_paths=image_paths,
                    total_duration=actual_duration,
                    output_path=base_video_path
                )
                self.tracker.record_usage("ffmpeg_renders", 1, job_id)

                # 5. Rendering & Compilation
                self.job_manager.update_status(job_id, "rendering")
                print(f"[{job_id}] ⚡ Step 5/6: Assembling video, subtitles & background music...")
                final_video_path = os.path.join(job_folder, f"{job_id}_final_9x16.mp4")
                assemble_result = self.assembler.assemble(
                    base_video_path=base_video_path,
                    voiceover_audio_path=audio_path,
                    output_video_path=final_video_path,
                    subtitles=script_data.get("subtitles", []),
                    hook_text=script_data.get("hook_text", "")
                )

                # 6. Ready
                final_job = self.job_manager.update_status(
                    job_id,
                    status="ready",
                    audio_url=audio_path,
                    video_url=final_video_path
                )
                print(f"[{job_id}] ✅ Step 6/6: Video READY! Duration: {assemble_result['duration_seconds']}s, Size: {assemble_result['file_size_kb']} KB")
                
                return {
                    "success": True,
                    "job_id": job_id,
                    "status": "ready",
                    "final_video_path": final_video_path,
                    "duration_seconds": assemble_result["duration_seconds"],
                    "file_size_kb": assemble_result["file_size_kb"],
                    "script_data": script_data,
                    "retry_count": attempt,
                    "fallback_used": tts_result.get("fallback_used", False)
                }

            except Exception as e:
                print(f"[{job_id}] ⚠️ Error on attempt {attempt+1}: {e}")
                if attempt < max_retries:
                    self.job_manager.update_status(job_id, "retrying", error_message=str(e), increment_retry=True)
                    time.sleep(0.5)
                else:
                    # Final Failure after 2 retries
                    print(f"[{job_id}] ❌ Job failed after {max_retries} retries. Switching to failed status.")
                    final_job = self.job_manager.update_status(
                        job_id,
                        status="failed",
                        error_message=f"Failed after {max_retries} retries: {str(e)}",
                        increment_retry=True
                    )
                    return {
                        "success": False,
                        "job_id": job_id,
                        "status": "failed",
                        "error": str(e),
                        "retry_count": max_retries
                    }

if __name__ == "__main__":
    p = ProductionPipeline()
    sample_img = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/sample_images/iced_v60.jpg"
    res = p.process_job([sample_img], "آيس دريب في 60 اثيوبي", style="مرِح")
    print(res)
