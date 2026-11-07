"""
FastAPI Server for Saudi Youth Cafe Video Generator
Connects n8n workflows, Next.js Dashboard, and video processing workers.
"""

import os
import json
import sqlite3
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from pipeline import ProductionPipeline
from job_manager import JobManager
from quota_tracker import QuotaTracker

app = FastAPI(title="Saudi Youth Cafe Video Automation API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/output")
os.makedirs(OUTPUT_DIR, exist_ok=True)
app.mount("/media", StaticFiles(directory=OUTPUT_DIR), name="media")

pipeline = ProductionPipeline()
job_manager = JobManager()
quota_tracker = QuotaTracker()

SETTINGS_FILE = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/settings.json")

def load_settings():
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    return {
        "script_engine": "free",       # "free" (Gemini/Groq) or "paid" (OpenAI GPT-4o)
        "video_engine": "free",        # "free" (FFmpeg Ken Burns) or "paid" (Kling/Luma API)
        "voice_engine": "free",        # "free" (Edge-TTS Saudi) or "paid" (ElevenLabs)
        "voice_gender": "male",        # "male" (Hamed) or "female" (Zariyah)
        "default_style": "مرِح",       # "مرِح", "أستيتيك", "ترند"
        "auto_publish": False,
        "warning_threshold": 80
    }

def save_settings(settings: dict):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=2, ensure_ascii=False)

class CreateJobRequest(BaseModel):
    image_paths: List[str]
    user_caption: Optional[str] = ""
    style: Optional[str] = "مرِح"
    telegram_chat_id: Optional[str] = None
    cafe_id: Optional[str] = "cafe-default-01"
    engine_mode: Optional[str] = "free"

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Saudi Youth Cafe Video Generator Engine",
        "market": "Saudi Arabia & Gulf",
        "version": "1.0.0"
    }

@app.post("/api/jobs/process")
def process_video_job(req: CreateJobRequest, background_tasks: BackgroundTasks):
    settings = load_settings()
    engine_mode = req.engine_mode or settings.get("voice_engine", "free")
    style = req.style or settings.get("default_style", "مرِح")

    # Run synchronously or return result
    res = pipeline.process_job(
        image_paths=req.image_paths,
        user_caption=req.user_caption,
        style=style,
        telegram_chat_id=req.telegram_chat_id,
        cafe_id=req.cafe_id,
        engine_mode=engine_mode
    )
    return res

@app.get("/api/jobs")
def get_jobs(limit: int = 50):
    jobs = job_manager.list_jobs(limit)
    for j in jobs:
        if j.get("video_url") and os.path.exists(j["video_url"]):
            rel_path = os.path.relpath(j["video_url"], OUTPUT_DIR)
            j["video_stream_url"] = f"/media/{rel_path}"
    return {"jobs": jobs, "total": len(jobs)}

@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.get("video_url") and os.path.exists(job["video_url"]):
        rel_path = os.path.relpath(job["video_url"], OUTPUT_DIR)
        job["video_stream_url"] = f"/media/{rel_path}"
    return job

@app.post("/api/jobs/{job_id}/approve")
def approve_job(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    updated = job_manager.update_status(job_id, status="published")
    return {"success": True, "job_id": job_id, "status": "published"}

@app.post("/api/jobs/{job_id}/regenerate")
def regenerate_job(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    images = job.get("original_images", [])
    caption = job.get("user_caption", "")
    style = job.get("style", "مرِح")

    res = pipeline.process_job(
        image_paths=images,
        user_caption=caption,
        style=style,
        telegram_chat_id=job.get("telegram_chat_id"),
        cafe_id=job.get("cafe_id", "cafe-default-01"),
        job_id=job_id
    )
    return res

@app.get("/api/quotas")
def get_quotas():
    return quota_tracker.get_all_quotas()

@app.get("/api/settings")
def get_settings_endpoint():
    return load_settings()

@app.post("/api/settings")
def update_settings_endpoint(settings: dict):
    save_settings(settings)
    return {"success": True, "settings": settings}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
