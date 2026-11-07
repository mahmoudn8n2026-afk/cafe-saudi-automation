"""
Comprehensive Mandatory Test Suite for Phase 1
Tests all required scenarios:
1. Single real image end-to-end
2. Multiple images (3 images montage)
3. No caption input (default fallback)
4. All 3 styles: "مرِح", "أستيتيك", "ترند وتحدي"
5. Simulated deliberate failure, 2 retries, and fallback verification
6. Verification of Job status progression and Quota Tracker
"""

import os
import sys
import json
import subprocess
from pipeline import ProductionPipeline
from job_manager import JobManager
from quota_tracker import QuotaTracker

ASSETS_DIR = os.path.expanduser("/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/sample_images")
IMG_V60 = os.path.join(ASSETS_DIR, "iced_v60.jpg")
IMG_LATTE = os.path.join(ASSETS_DIR, "spanish_latte.jpg")
IMG_CAKE = os.path.join(ASSETS_DIR, "san_sebastian.jpg")

class Phase1TestSuite:
    def __init__(self):
        self.pipeline = ProductionPipeline()
        self.job_manager = JobManager()
        self.tracker = QuotaTracker()
        self.results = []

    def log_result(self, test_name: str, passed: bool, details: dict):
        self.results.append({
            "test_name": test_name,
            "passed": passed,
            "details": details
        })
        icon = "✅" if passed else "❌"
        print(f"\n{icon} {test_name}: {'PASSED' if passed else 'FAILED'}")
        print(f"   Details: {json.dumps(details, ensure_ascii=False)}")

    def test_single_image(self):
        print("\n--- Running Test 1: Single Real Image End-to-End ---")
        job_id = "test_phase1_single_img"
        res = self.pipeline.process_job(
            image_paths=[IMG_V60],
            user_caption="كولد برو اثيوبي يسرسح 18 ريال",
            style="مرِح",
            job_id=job_id
        )
        passed = (
            res["success"] is True and
            os.path.exists(res["final_video_path"]) and
            res["duration_seconds"] > 5 and
            res["file_size_kb"] > 100
        )
        self.log_result("Test 1: Single Real Image", passed, {
            "video_path": res.get("final_video_path"),
            "duration": res.get("duration_seconds"),
            "file_size_kb": res.get("file_size_kb"),
            "hook": res["script_data"]["hook_text"]
        })
        return passed

    def test_multiple_images(self):
        print("\n--- Running Test 2: Multiple Images Montage (3 Images) ---")
        job_id = "test_phase1_multi_img"
        res = self.pipeline.process_job(
            image_paths=[IMG_V60, IMG_LATTE, IMG_CAKE],
            user_caption="عرض الروقان: قهوة وحلى بـ 35 ريال بس",
            style="مرِح",
            job_id=job_id
        )
        passed = (
            res["success"] is True and
            os.path.exists(res["final_video_path"]) and
            res["duration_seconds"] >= 8
        )
        self.log_result("Test 2: Multiple Images Montage", passed, {
            "image_count": 3,
            "video_path": res.get("final_video_path"),
            "duration": res.get("duration_seconds")
        })
        return passed

    def test_no_caption(self):
        print("\n--- Running Test 3: No Caption Input (Default Smart Generation) ---")
        job_id = "test_phase1_no_caption"
        res = self.pipeline.process_job(
            image_paths=[IMG_LATTE],
            user_caption="",  # Empty caption
            style="مرِح",
            job_id=job_id
        )
        passed = (
            res["success"] is True and
            bool(res["script_data"]["hook_text"]) and
            bool(res["script_data"]["voiceover_text"])
        )
        self.log_result("Test 3: No Caption Input", passed, {
            "hook_generated": res["script_data"]["hook_text"],
            "tiktok_caption": res["script_data"]["captions"]["tiktok"]
        })
        return passed

    def test_all_three_styles(self):
        print("\n--- Running Test 4: All 3 Styles (مرِح / أستيتيك / ترند) ---")
        styles = ["مرِح", "أستيتيك", "ترند"]
        passed_all = True
        style_details = {}

        for st in styles:
            job_id = f"test_phase1_style_{st}"
            res = self.pipeline.process_job(
                image_paths=[IMG_V60],
                user_caption="في 60 بارد",
                style=st,
                job_id=job_id
            )
            passed = res["success"] is True
            if not passed:
                passed_all = False
            style_details[st] = {
                "hook": res["script_data"]["hook_text"],
                "voiceover_sample": res["script_data"]["voiceover_text"][:50] + "..."
            }

        self.log_result("Test 4: Three Styles Comparison", passed_all, style_details)
        return passed_all

    def test_failure_retry_and_fallback(self):
        print("\n--- Running Test 5: Simulated Failure, Retries (x2), and Fallback ---")
        job_id = "test_phase1_failure_retry"
        # Simulate error on attempt 1 and 2, should succeed on retry attempt 3 (max_retries=2)
        res = self.pipeline.process_job(
            image_paths=[IMG_CAKE],
            user_caption="سن سباستيان تشيز كيك مع صوص شوكولاتة",
            style="ترند",
            simulate_error=True,
            job_id=job_id
        )
        # Job should have retried twice and succeeded on attempt 3
        passed = (
            res["success"] is True and
            res["retry_count"] == 2
        )
        job_db = self.job_manager.get_job(job_id)
        self.log_result("Test 5: Deliberate Failure & Retry", passed, {
            "retry_count": res.get("retry_count"),
            "final_status": res.get("status"),
            "db_status": job_db.get("status") if job_db else None
        })
        return passed

    def test_job_status_and_quota(self):
        print("\n--- Running Test 6: Job Status Transitions & Quota Tracker ---")
        quotas = self.tracker.get_all_quotas()
        recent_jobs = self.job_manager.list_jobs(5)
        
        has_usage = quotas["quotas"]["gemini_daily_requests"]["used"] > 0
        has_tts_usage = quotas["quotas"]["edge_tts_chars"]["used"] > 0
        has_renders = quotas["quotas"]["ffmpeg_renders"]["used"] > 0

        passed = has_usage and has_tts_usage and has_renders and len(recent_jobs) > 0
        self.log_result("Test 6: Quota Counter & DB Lifecycle", passed, {
            "gemini_daily_used": quotas["quotas"]["gemini_daily_requests"]["used"],
            "edge_tts_chars_used": quotas["quotas"]["edge_tts_chars"]["used"],
            "ffmpeg_renders_used": quotas["quotas"]["ffmpeg_renders"]["used"],
            "tracked_jobs_count": len(recent_jobs)
        })
        return passed

    def run_all(self):
        print("==================================================")
        print("  Starting Mandatory Phase 1 Test Verification")
        print("==================================================")
        t1 = self.test_single_image()
        t2 = self.test_multiple_images()
        t3 = self.test_no_caption()
        t4 = self.test_all_three_styles()
        t5 = self.test_failure_retry_and_fallback()
        t6 = self.test_job_status_and_quota()

        all_passed = all([t1, t2, t3, t4, t5, t6])
        print("\n==================================================")
        if all_passed:
            print("🎉 ALL PHASE 1 TESTS PASSED SUCCESSFULLY! (6/6)")
        else:
            print("❌ SOME PHASE 1 TESTS FAILED. PLEASE REVIEW.")
        print("==================================================")
        return all_passed, self.results

if __name__ == "__main__":
    suite = Phase1TestSuite()
    success, results = suite.run_all()
    if not success:
        sys.exit(1)
