"""
Job Manager & State Machine
Handles persistent job tracking across states:
received -> scripting -> video -> voice -> rendering -> ready -> published (or failed)
Works with Supabase (via REST API) or local SQLite database seamlessly.
"""

import os
import json
import sqlite3
from datetime import datetime
from typing import Dict, Any, Optional, List
import requests

LOCAL_DB_PATH = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/backend/jobs.db")

class JobManager:
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        self.supabase_url = supabase_url or os.environ.get("SUPABASE_URL")
        self.supabase_key = supabase_key or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
        self._init_local_db()

    def _init_local_db(self):
        os.makedirs(os.path.dirname(LOCAL_DB_PATH), exist_ok=True)
        with sqlite3.connect(LOCAL_DB_PATH) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS jobs (
                    id TEXT PRIMARY KEY,
                    cafe_id TEXT DEFAULT 'cafe-default-01',
                    telegram_chat_id TEXT,
                    original_images TEXT,
                    user_caption TEXT,
                    style TEXT DEFAULT 'مرِح',
                    status TEXT NOT NULL,
                    script_data TEXT,
                    audio_url TEXT,
                    video_url TEXT,
                    retry_count INTEGER DEFAULT 0,
                    error_message TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()

    def create_job(
        self,
        job_id: str,
        image_paths: List[str],
        user_caption: Optional[str] = "",
        style: str = "مرِح",
        telegram_chat_id: Optional[str] = None,
        cafe_id: str = "cafe-default-01"
    ) -> Dict[str, Any]:
        now = datetime.now().isoformat()
        job_data = {
            "id": job_id,
            "cafe_id": cafe_id,
            "telegram_chat_id": str(telegram_chat_id) if telegram_chat_id else "",
            "original_images": json.dumps(image_paths, ensure_ascii=False),
            "user_caption": user_caption or "",
            "style": style,
            "status": "received",
            "retry_count": 0,
            "created_at": now,
            "updated_at": now
        }

        # Write to local DB
        with sqlite3.connect(LOCAL_DB_PATH) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO jobs (id, cafe_id, telegram_chat_id, original_images, user_caption, style, status, retry_count, created_at, updated_at)
                VALUES (:id, :cafe_id, :telegram_chat_id, :original_images, :user_caption, :style, :status, :retry_count, :created_at, :updated_at)
            """, job_data)
            conn.commit()

        # If Supabase configured, sync to Supabase
        if self.supabase_url and self.supabase_key:
            try:
                headers = {
                    "apikey": self.supabase_key,
                    "Authorization": f"Bearer {self.supabase_key}",
                    "Content-Type": "application/json",
                    "Prefer": "resolution=merge-duplicates"
                }
                requests.post(f"{self.supabase_url}/rest/v1/jobs", headers=headers, json=job_data, timeout=5)
            except Exception as e:
                print(f"[JobManager] Supabase sync notice: {e}")

        return job_data

    def update_status(
        self,
        job_id: str,
        status: str,
        script_data: Optional[Dict[str, Any]] = None,
        audio_url: Optional[str] = None,
        video_url: Optional[str] = None,
        error_message: Optional[str] = None,
        increment_retry: bool = False
    ) -> Dict[str, Any]:
        now = datetime.now().isoformat()
        with sqlite3.connect(LOCAL_DB_PATH) as conn:
            cursor = conn.cursor()
            updates = ["status = ?", "updated_at = ?"]
            params = [status, now]

            if script_data is not None:
                updates.append("script_data = ?")
                params.append(json.dumps(script_data, ensure_ascii=False))
            if audio_url is not None:
                updates.append("audio_url = ?")
                params.append(audio_url)
            if video_url is not None:
                updates.append("video_url = ?")
                params.append(video_url)
            if error_message is not None:
                updates.append("error_message = ?")
                params.append(error_message)
            if increment_retry:
                updates.append("retry_count = retry_count + 1")

            params.append(job_id)
            query = f"UPDATE jobs SET {', '.join(updates)} WHERE id = ?"
            cursor.execute(query, params)
            conn.commit()

        # Sync update to Supabase if configured
        if self.supabase_url and self.supabase_key:
            try:
                headers = {
                    "apikey": self.supabase_key,
                    "Authorization": f"Bearer {self.supabase_key}",
                    "Content-Type": "application/json"
                }
                payload = {"status": status, "updated_at": now}
                if script_data is not None:
                    payload["script_data"] = script_data
                if audio_url is not None:
                    payload["audio_url"] = audio_url
                if video_url is not None:
                    payload["video_url"] = video_url
                if error_message is not None:
                    payload["error_message"] = error_message
                requests.patch(f"{self.supabase_url}/rest/v1/jobs?id=eq.{job_id}", headers=headers, json=payload, timeout=5)
            except Exception as e:
                pass

        return self.get_job(job_id)

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        with sqlite3.connect(LOCAL_DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            if data.get("original_images"):
                try:
                    data["original_images"] = json.loads(data["original_images"])
                except Exception:
                    pass
            if data.get("script_data"):
                try:
                    data["script_data"] = json.loads(data["script_data"])
                except Exception:
                    pass
            return data

    def list_jobs(self, limit: int = 50) -> List[Dict[str, Any]]:
        with sqlite3.connect(LOCAL_DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            jobs = []
            for r in rows:
                item = dict(r)
                if item.get("original_images"):
                    try:
                        item["original_images"] = json.loads(item["original_images"])
                    except Exception:
                        pass
                if item.get("script_data"):
                    try:
                        item["script_data"] = json.loads(item["script_data"])
                    except Exception:
                        pass
                jobs.append(item)
            return jobs

if __name__ == "__main__":
    jm = JobManager()
    j = jm.create_job("job-test-1", ["/path/to/img1.jpg"], "سبانش لاتيه بارد", "مرِح")
    print("Created:", j["status"])
    u = jm.update_status("job-test-1", "scripting", script_data={"test": "ok"})
    print("Updated:", u["status"])
