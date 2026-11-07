"""
Quota and Consumption Tracker for Free & Paid Services
Tracks consumption across Gemini, ElevenLabs, AI Video, Supabase, and FFmpeg
"""

import json
import os
import sqlite3
from datetime import datetime

DB_PATH = os.environ.get("QUOTA_DB_PATH", os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/quotas.db"))

DEFAULT_LIMITS = {
    "gemini_daily_requests": {"limit": 1500, "period": "daily", "label": "Gemini API (طلبات يومية)"},
    "elevenlabs_monthly_chars": {"limit": 10000, "period": "monthly", "label": "ElevenLabs (حروف شهريًا)"},
    "ai_video_monthly_clips": {"limit": 60, "period": "monthly", "label": "AI Video Kling/Luma (مقاطع شهريًا)"},
    "supabase_storage_mb": {"limit": 1000, "period": "fixed", "label": "Supabase Storage (ميجابايت)"},
    "ffmpeg_renders": {"limit": 999999, "period": "monthly", "label": "FFmpeg Ken Burns (مجاني غير محدود)"},
    "edge_tts_chars": {"limit": 999999, "period": "monthly", "label": "Edge-TTS السعودي (مجاني غير محدود)"}
}

class QuotaTracker:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        with self._get_conn() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS usage_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    service TEXT NOT NULL,
                    amount INTEGER NOT NULL,
                    job_id TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS quota_settings (
                    service TEXT PRIMARY KEY,
                    limit_value INTEGER NOT NULL,
                    warning_threshold REAL DEFAULT 0.8
                )
            """)
            conn.commit()

    def record_usage(self, service: str, amount: int, job_id: str = None):
        with self._get_conn() as conn:
            conn.execute(
                "INSERT INTO usage_logs (service, amount, job_id) VALUES (?, ?, ?)",
                (service, amount, job_id)
            )
            conn.commit()

    def get_service_usage(self, service: str) -> dict:
        now = datetime.now()
        cur_month = now.strftime("%Y-%m")
        cur_day = now.strftime("%Y-%m-%d")

        cfg = DEFAULT_LIMITS.get(service, {"limit": 1000, "period": "monthly", "label": service})
        limit = cfg["limit"]
        period = cfg["period"]

        with self._get_conn() as conn:
            cursor = conn.cursor()
            if period == "daily":
                cursor.execute(
                    "SELECT COALESCE(SUM(amount), 0) FROM usage_logs WHERE service = ? AND date(created_at) = ?",
                    (service, cur_day)
                )
            elif period == "monthly":
                cursor.execute(
                    "SELECT COALESCE(SUM(amount), 0) FROM usage_logs WHERE service = ? AND strftime('%Y-%m', created_at) = ?",
                    (service, cur_month)
                )
            else:
                cursor.execute(
                    "SELECT COALESCE(SUM(amount), 0) FROM usage_logs WHERE service = ?",
                    (service,)
                )
            used = cursor.fetchone()[0]

        remaining = max(0, limit - used)
        percent = (used / limit * 100) if limit > 0 else 0
        is_warning = (percent >= 80.0) and (limit < 900000)
        is_exhausted = (used >= limit) and (limit < 900000)

        # Estimate remaining videos based on consumption profile
        if service == "elevenlabs_monthly_chars":
            remaining_videos = remaining // 200  # avg 200 chars per 15s video
        elif service == "gemini_daily_requests":
            remaining_videos = remaining
        elif service == "ai_video_monthly_clips":
            remaining_videos = remaining // 2  # avg 2 clips per video
        else:
            remaining_videos = 9999

        return {
            "service": service,
            "label": cfg.get("label", service),
            "period": period,
            "used": used,
            "limit": limit,
            "remaining": remaining,
            "percentage": round(percent, 1),
            "is_warning": is_warning,
            "is_exhausted": is_exhausted,
            "estimated_remaining_videos": remaining_videos
        }

    def get_all_quotas(self) -> dict:
        results = {}
        warnings = []
        for s in DEFAULT_LIMITS.keys():
            stat = self.get_service_usage(s)
            results[s] = stat
            if stat["is_warning"]:
                warnings.append(f"⚠️ تنبيه: خدمة {stat['label']} استهلكت {stat['percentage']}% (المتبقي: {stat['remaining']})")
            if stat["is_exhausted"]:
                warnings.append(f"🚨 تحذير عاجل: خدمة {stat['label']} استنفدت حدها المجاني بالكامل! سيتم التبديل للبديل المجاني تلقائيًا.")
        return {
            "quotas": results,
            "warnings": warnings,
            "has_warnings": len(warnings) > 0,
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    tracker = QuotaTracker()
    tracker.record_usage("gemini_daily_requests", 1, "test-job-001")
    tracker.record_usage("elevenlabs_monthly_chars", 185, "test-job-001")
    print(json.dumps(tracker.get_all_quotas(), indent=2, ensure_ascii=False))
