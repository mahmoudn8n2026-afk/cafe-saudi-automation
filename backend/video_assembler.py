"""
Video Assembler for Saudi Youth Cafe Video Ads
Combines Ken Burns video clips, Arabic voiceover, background music,
and modern styled animated Arabic subtitle stickers (9:16 vertical MP4).
"""

import os
import subprocess
from typing import List, Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

FONT_PATH = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/fonts/ArabicFont.ttc")
MUSIC_PATH = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/music/cafe_beat.mp3")

class VideoAssembler:
    def __init__(self, font_path: str = FONT_PATH, default_music: str = MUSIC_PATH):
        self.font_path = font_path
        self.default_music = default_music

    def _render_text_overlay(
        self,
        output_png: str,
        bottom_text: str = "",
        top_hook_text: str = "",
        highlight_color: tuple = (255, 220, 0, 255)
    ):
        """
        Creates a 1080x1920 transparent PNG with:
        - Top hook banner (first seconds attention grabber)
        - Bottom subtitle sticker (TikTok/Reels style rounded pill with glow/border)
        """
        os.makedirs(os.path.dirname(os.path.abspath(output_png)), exist_ok=True)
        img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # 1. Top Hook Banner (if present)
        if top_hook_text:
            hook_font = ImageFont.truetype(self.font_path, 60)
            reshaped_hook = arabic_reshaper.reshape(top_hook_text)
            bidi_hook = get_display(reshaped_hook)
            
            # Draw gradient/accent card
            box_w, box_h = 860, 140
            x1 = (1080 - box_w) // 2
            y1 = 280
            draw.rounded_rectangle([x1, y1, x1 + box_w, y1 + box_h], radius=30, fill=(20, 20, 20, 220), outline=highlight_color, width=5)
            draw.text((540, y1 + (box_h // 2)), bidi_hook, font=hook_font, fill=highlight_color, anchor="mm")

        # 2. Bottom Subtitle Sticker
        if bottom_text:
            sub_font = ImageFont.truetype(self.font_path, 52)
            reshaped_sub = arabic_reshaper.reshape(bottom_text)
            bidi_sub = get_display(reshaped_sub)

            # Subtitle card at bottom (above TikTok UI buttons, around y=1420)
            box_w = min(980, max(500, len(bottom_text) * 32))
            box_h = 130
            x1 = (1080 - box_w) // 2
            y1 = 1420
            # Dark blurred aesthetic pill with gold/yellow border
            draw.rounded_rectangle([x1, y1, x1 + box_w, y1 + box_h], radius=35, fill=(10, 10, 10, 220), outline=(255, 255, 255, 180), width=3)
            # Yellow bullet emoji or dot
            draw.text((540, y1 + (box_h // 2)), bidi_sub, font=sub_font, fill=(255, 255, 255, 255), anchor="mm")

        img.save(output_png, "PNG")

    def assemble(
        self,
        base_video_path: str,
        voiceover_audio_path: str,
        output_video_path: str,
        subtitles: List[Dict[str, Any]],
        hook_text: str = "",
        music_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Merges base video, voiceover, music, and creates timed subtitle overlays.
        """
        os.makedirs(os.path.dirname(os.path.abspath(output_video_path)), exist_ok=True)
        work_dir = os.path.dirname(os.path.abspath(output_video_path))
        bg_music = music_path or self.default_music

        # 1. Measure voiceover duration
        probe_cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", voiceover_audio_path
        ]
        duration_res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, text=True, check=True)
        total_duration = float(duration_res.stdout.strip())
        # Add 1.0s buffer at end for smooth fade
        final_duration = total_duration + 0.8

        # 2. Generate subtitle overlay PNG cards and build FFmpeg complex filter
        overlay_inputs = []
        filter_parts = []
        current_layer = "[0:v]"

        # Generate cards for each subtitle segment
        for i, sub in enumerate(subtitles):
            card_png = os.path.join(work_dir, f"sub_card_{i}.png")
            start_t = sub.get("start", 0.0)
            end_t = min(sub.get("end", start_t + 3.0), final_duration)
            
            # Show top hook only in first card / first 3 seconds
            show_hook = hook_text if start_t < 3.5 else ""
            
            self._render_text_overlay(card_png, bottom_text=sub.get("text", ""), top_hook_text=show_hook)
            overlay_inputs.extend(["-i", card_png])
            
            input_idx = 3 + i  # 0=base video, 1=voice, 2=music, 3+=subtitles
            next_layer = f"[v_{i+1}]"
            filter_parts.append(
                f"{current_layer}[{input_idx}:v]overlay=0:0:enable='between(t,{start_t:.2f},{end_t:.2f})'{next_layer}"
            )
            current_layer = next_layer

        # Build full filter complex
        # Video pipeline
        video_filters = ";".join(filter_parts) if filter_parts else f"{current_layer}null[final_v]"
        if filter_parts:
            video_filters += f";{current_layer}scale=1080:1920[final_v]"

        # Audio mixing: Voice (vol 1.0) + Music (vol 0.15) with fade out
        audio_filter = (
            f"[1:a]volume=1.0[vocal];"
            f"[2:a]volume=0.15,afade=t=out:st={max(0, final_duration - 1.5):.2f}:d=1.5[music];"
            f"[vocal][music]amix=inputs=2:duration=first:dropout_transition=2[final_a]"
        )

        full_filter = f"{video_filters};{audio_filter}"

        # 3. Execute FFmpeg
        cmd = [
            "ffmpeg", "-y",
            "-i", base_video_path,
            "-i", voiceover_audio_path,
            "-stream_loop", "-1", "-i", bg_music
        ] + overlay_inputs + [
            "-filter_complex", full_filter,
            "-map", "[final_v]",
            "-map", "[final_a]",
            "-t", str(final_duration),
            "-c:v", "libx264", "-preset", "fast", "-crf", "22",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            output_video_path
        ]

        try:
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        finally:
            # Clean up temp overlay cards
            for i in range(len(subtitles)):
                card_png = os.path.join(work_dir, f"sub_card_{i}.png")
                if os.path.exists(card_png):
                    os.remove(card_png)

        file_size_kb = os.path.getsize(output_video_path) // 1024

        return {
            "success": True,
            "output_path": output_video_path,
            "duration_seconds": round(final_duration, 2),
            "file_size_kb": file_size_kb,
            "resolution": "1080x1920",
            "aspect_ratio": "9:16",
            "has_subtitles": True,
            "has_music": True
        }

if __name__ == "__main__":
    assembler = VideoAssembler()
    base_v = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/test_kb.mp4"
    voice_a = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/test_tts.mp3"
    out_v = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/test_final_video.mp4"
    subs = [
        {"text": "يا ساتر على الروقان!", "start": 0.0, "end": 2.5},
        {"text": "هالمشروب يسرسح على القلب", "start": 2.5, "end": 5.5},
        {"text": "ويعدل مزاجك بكافيه الرياض!", "start": 5.5, "end": 8.5}
    ]
    res = assembler.assemble(base_v, voice_a, out_v, subs, hook_text="يسرسح على القلب! 🔥")
    print(res)
