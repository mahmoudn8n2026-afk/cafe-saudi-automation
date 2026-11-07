"""
Ken Burns Video Generator (9:16 Vertical Video for TikTok, Reels, Snapchat)
Converts 1 or more static photos into cinematic 1080x1920 video clips with smooth motion.
Supports single image or multi-image montage with dynamic transitions.
"""

import os
import subprocess
from typing import List, Optional
from PIL import Image

class KenBurnsGenerator:
    def __init__(self, target_width: int = 1080, target_height: int = 1920, fps: int = 30):
        self.width = target_width
        self.height = target_height
        self.fps = fps

    def _prepare_base_image(self, input_image: str, temp_output: str):
        """
        Resize & crop input image to high-res 9:16 canvas (e.g., 1440x2560) 
        so zoompan has crisp margin without black borders.
        """
        img = Image.open(input_image).convert("RGB")
        target_ratio = self.width / self.height
        img_ratio = img.width / img.height

        if img_ratio > target_ratio:
            # Image is wider -> match height, crop width
            new_height = 2560
            new_width = int(new_height * img_ratio)
        else:
            # Image is taller or equal -> match width, crop height
            new_width = 1440
            new_height = int(new_width / img_ratio)

        resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Center crop to 1440x2560
        left = (new_width - 1440) // 2
        top = (new_height - 2560) // 2
        cropped = resized.crop((left, top, left + 1440, top + 2560))
        cropped.save(temp_output, quality=95)

    def create_clip(self, input_image: str, duration: float, output_clip: str, effect_type: str = "zoom_in") -> str:
        """
        Creates a single 9:16 clip from an image with specified Ken Burns effect.
        effect_type: "zoom_in", "zoom_out", "pan_up", "pan_down"
        """
        os.makedirs(os.path.dirname(os.path.abspath(output_clip)), exist_ok=True)
        temp_prep = output_clip + ".prep.jpg"
        self._prepare_base_image(input_image, temp_prep)

        total_frames = int(duration * self.fps)

        if effect_type == "zoom_in":
            # Smooth zoom from 1.0 to 1.15 centered
            z_expr = f"min(zoom+0.0015,1.20)"
            x_expr = "iw/2-(iw/zoom/2)"
            y_expr = "ih/2-(ih/zoom/2)"
        elif effect_type == "zoom_out":
            # Smooth zoom out from 1.20 to 1.05
            z_expr = f"if(eq(on,1),1.20,max(zoom-0.0015,1.05))"
            x_expr = "iw/2-(iw/zoom/2)"
            y_expr = "ih/2-(ih/zoom/2)"
        elif effect_type == "pan_up":
            # Gentle zoom + pan from bottom to top
            z_expr = "1.12"
            x_expr = "iw/2-(iw/zoom/2)"
            y_expr = f"(ih-ih/zoom)*(1-on/{total_frames})"
        else:
            # Default zoom in
            z_expr = "min(zoom+0.0012,1.18)"
            x_expr = "iw/2-(iw/zoom/2)"
            y_expr = "ih/2-(ih/zoom/2)"

        filter_complex = (
            f"zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':"
            f"d={total_frames}:s={self.width}x{self.height}:fps={self.fps}"
        )

        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", temp_prep,
            "-vf", filter_complex,
            "-t", str(duration),
            "-c:v", "libx264", "-preset", "ultrafast",
            "-pix_fmt", "yuv420p",
            output_clip
        ]

        try:
            subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        finally:
            if os.path.exists(temp_prep):
                os.remove(temp_prep)

        return output_clip

    def generate_montage(self, image_paths: List[str], total_duration: float, output_path: str) -> str:
        """
        Generates full montage from 1 or more images fitting exact total_duration.
        """
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        num_images = len(image_paths)
        if num_images == 0:
            raise ValueError("At least one image path is required.")

        clip_duration = total_duration / num_images
        effects = ["zoom_in", "pan_up", "zoom_out", "pan_down"]
        clips = []

        work_dir = os.path.dirname(output_path)

        for i, img_path in enumerate(image_paths):
            effect = effects[i % len(effects)]
            clip_file = os.path.join(work_dir, f"subclip_{i}.mp4")
            self.create_clip(img_path, clip_duration, clip_file, effect)
            clips.append(clip_file)

        if len(clips) == 1:
            os.replace(clips[0], output_path)
            return output_path

        # Concatenate clips
        concat_txt = os.path.join(work_dir, "concat_list.txt")
        with open(concat_txt, "w") as f:
            for c in clips:
                f.write(f"file '{os.path.abspath(c)}'\n")

        cmd = [
            "ffmpeg", "-y",
            "-f", "concat", "-safe", "0",
            "-i", concat_txt,
            "-c", "copy",
            output_path
        ]
        try:
            subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        finally:
            if os.path.exists(concat_txt):
                os.remove(concat_txt)
            for c in clips:
                if os.path.exists(c):
                    os.remove(c)

        return output_path

if __name__ == "__main__":
    kb = KenBurnsGenerator()
    sample_img = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/sample_images/iced_v60.jpg"
    out_video = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/test_kb.mp4"
    kb.generate_montage([sample_img], 5.0, out_video)
    print(f"Generated test Ken Burns video at {out_video}")
