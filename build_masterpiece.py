import os
import subprocess
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

out_dir = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/output/masterpiece"
os.makedirs(out_dir, exist_ok=True)

font_path = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/fonts/Tahoma-Bold.ttf"
music_path = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/music/real_cafe_beat.mp3"
voice_path = "/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/voice_perfect_hamed.mp3"

# Measure audio duration
dur_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voice_path]
audio_dur = float(subprocess.run(dur_cmd, stdout=subprocess.PIPE, text=True).stdout.strip())
total_dur = round(audio_dur + 0.8, 2)
print(f"Audio duration: {audio_dur}s, Total target: {total_dur}s")

# 3 Shots
shot1_dur = 4.5
shot2_dur = 4.8
shot3_dur = round(total_dur - shot1_dur - shot2_dur, 2)

shots = [
    ("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/real_cafe_photos/prep1.jpg", "clip_1.mp4", "zoom_in", shot1_dur),
    ("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/real_cafe_photos/prep2.jpg", "clip_2.mp4", "pan_up", shot2_dur),
    ("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/real_cafe_photos/prep3_basque.jpg", "clip_3.mp4", "zoom_out", shot3_dur)
]

clip_paths = []
fps = 30

for i, (img_p, c_name, effect, c_dur) in enumerate(shots):
    clip_out = os.path.join(out_dir, c_name)
    img = Image.open(img_p).convert("RGB")
    prep_p = os.path.join(out_dir, f"prep_{i}.jpg")
    img.resize((1440, 2560), Image.Resampling.LANCZOS).save(prep_p, quality=95)
    
    n_frames = int(c_dur * fps)
    if effect == "zoom_in":
        z_expr = "min(zoom+0.0011,1.18)"
        x_expr = "iw/2-(iw/zoom/2)"
        y_expr = "ih/2-(ih/zoom/2)"
    elif effect == "pan_up":
        z_expr = "1.12"
        x_expr = "iw/2-(iw/zoom/2)"
        y_expr = f"(ih-ih/zoom)*(1-on/{n_frames})"
    else:
        z_expr = f"if(eq(on,1),1.16,max(zoom-0.0011,1.03))"
        x_expr = "iw/2-(iw/zoom/2)"
        y_expr = "ih/2-(ih/zoom/2)"

    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", prep_p,
        "-vf", f"zoompan=z='{z_expr}':x='{x_expr}':y='{y_expr}':d={n_frames}:s=1080x1920:fps={fps}",
        "-t", str(c_dur),
        "-c:v", "libx264", "-preset", "fast", "-pix_fmt", "yuv420p",
        clip_out
    ]
    subprocess.run(cmd, check=True)
    if os.path.exists(prep_p):
        os.remove(prep_p)
    clip_paths.append(clip_out)

# Concatenate shots
concat_txt = os.path.join(out_dir, "concat.txt")
with open(concat_txt, "w") as f:
    for c in clip_paths:
        f.write(f"file '{c}'\n")

montage_mp4 = os.path.join(out_dir, "montage.mp4")
subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_txt, "-c", "copy", montage_mp4], check=True)

# Subtitle Cards with ZERO TOFU GUARANTEE
subtitles = [
    {"top": "هبة كافيهات الرياض", "bottom": "يا هلا والله! إذا ودك تروق على أصولها", "start": 0.0, "end": 4.5},
    {"top": "مشروبات تسرسح على القلب", "bottom": "كولد برو وسبانش مثلج يضبط المزاج", "start": 4.5, "end": 9.3},
    {"top": "حلا يضبط روقانك", "bottom": "ومعاهم تشيز كيك تذوب بالفم", "start": 9.3, "end": 12.2},
    {"top": "كافيه أروما الرياض", "bottom": "مرنا وعيش الجو وخويك اليوم يعزمك", "start": 12.2, "end": total_dur}
]

reshaper = arabic_reshaper.ArabicReshaper(configuration={'delete_harakat': True, 'support_ligatures': False})
top_font = ImageFont.truetype(font_path, 36)
sub_font = ImageFont.truetype(font_path, 42)

overlay_inputs = []
filter_parts = []
curr_v = "[0:v]"

for i, sub in enumerate(subtitles):
    card_png = os.path.join(out_dir, f"card_{i}.png")
    img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Top Amber Luxury Pill
    top_shaped = get_display(reshaper.reshape(sub["top"]))
    w_top, h_top = 500, 78
    x1_top = (1080 - w_top) // 2
    y1_top = 230
    draw.rounded_rectangle([x1_top, y1_top, x1_top + w_top, y1_top + h_top], radius=22, fill=(16, 12, 8, 230), outline=(245, 158, 11, 240), width=3)
    draw.text((540, y1_top + (h_top // 2)), top_shaped, font=top_font, fill=(255, 215, 130, 255), anchor="mm")
    
    # Bottom Subtitle Card
    sub_shaped = get_display(reshaper.reshape(sub["bottom"]))
    w_sub = min(980, max(580, len(sub["bottom"]) * 27))
    h_sub = 118
    x1_sub = (1080 - w_sub) // 2
    y1_sub = 1460
    draw.rounded_rectangle([x1_sub, y1_sub, x1_sub + w_sub, y1_sub + h_sub], radius=30, fill=(12, 10, 8, 235), outline=(255, 255, 255, 190), width=3)
    draw.text((540, y1_sub + (h_sub // 2)), sub_shaped, font=sub_font, fill=(255, 255, 255, 255), anchor="mm")
    
    img.save(card_png, "PNG")
    overlay_inputs.extend(["-i", card_png])
    
    in_idx = 3 + i
    next_v = f"[v_{i+1}]"
    filter_parts.append(f"{curr_v}[{in_idx}:v]overlay=0:0:enable='between(t,{sub['start']:.2f},{sub['end']:.2f})'{next_v}")
    curr_v = next_v

video_pipeline = ";".join(filter_parts) + f";{curr_v}scale=1080:1920[final_v]"
audio_pipeline = (
    f"[1:a]volume=1.0[vocal];"
    f"[2:a]volume=0.12,afade=t=out:st={total_dur - 1.5:.2f}:d=1.5[music];"
    f"[vocal][music]amix=inputs=2:duration=first:dropout_transition=2[final_a]"
)

final_mp4 = os.path.join(out_dir, "saudi_cafe_masterpiece.mp4")
cmd_final = [
    "ffmpeg", "-y",
    "-i", montage_mp4,
    "-i", voice_path,
    "-stream_loop", "-1", "-i", music_path
] + overlay_inputs + [
    "-filter_complex", f"{video_pipeline};{audio_pipeline}",
    "-map", "[final_v]",
    "-map", "[final_a]",
    "-t", str(total_dur),
    "-c:v", "libx264", "-preset", "medium", "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k",
    final_mp4
]

print("Assembling final masterpiece...")
subprocess.run(cmd_final, check=True)

# Cleanup temporary cards
for i in range(len(subtitles)):
    c_f = os.path.join(out_dir, f"card_{i}.png")
    if os.path.exists(c_f):
        os.remove(c_f)

print(f"SUCCESS: Generated {final_mp4} ({os.path.getsize(final_mp4) // 1024} KB)")
