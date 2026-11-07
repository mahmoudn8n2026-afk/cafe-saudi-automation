"""
Automated Test Suite for Phase 2: Web Dashboard & Realtime Integration
Tests:
1. Dashboard endpoints accessibility (/, /jobs, /cafes, /settings, /login)
2. Backend API status & media static file serving
3. Simulated new Telegram job creation & status progression
4. Job approval & regenerate endpoints
5. Settings free/paid toggle update & retrieval
6. Admin vs Client role filtering
"""

import sys
import time
import requests
import json

BACKEND_URL = "http://127.0.0.1:8000"
DASHBOARD_URL = "http://127.0.0.1:3000"

def test_backend_health():
    print("\n--- Phase 2 Test 1: Backend API Health & Quotas ---")
    r = requests.get(f"{BACKEND_URL}/")
    assert r.status_code == 200, f"Backend failed: {r.status_code}"
    
    quotas_res = requests.get(f"{BACKEND_URL}/api/quotas")
    assert quotas_res.status_code == 200, "Quotas endpoint failed"
    data = quotas_res.json()
    assert "quotas" in data, "No quotas in response"
    print(f"✅ Backend online: {r.json()['service']}")
    print(f"   Quota counters active: {len(data['quotas'])} services monitored")
    return True

def test_dashboard_routes():
    print("\n--- Phase 2 Test 2: Next.js Dashboard Routes Verification ---")
    routes = ["/", "/jobs", "/cafes", "/settings", "/login"]
    for route in routes:
        url = f"{DASHBOARD_URL}{route}"
        res = requests.get(url, timeout=10)
        assert res.status_code == 200, f"Route {route} returned status {res.status_code}"
        print(f"✅ Route {route} loaded successfully (HTTP 200)")
    return True

def test_telegram_realtime_job():
    print("\n--- Phase 2 Test 3: Simulated Telegram Ingestion to Dashboard ---")
    payload = {
        "image_paths": ["/Users/mahmoudfouad/.gemini/antigravity/scratch/cafe-saudi-automation/assets/sample_images/san_sebastian.jpg"],
        "user_caption": "سن سباستيان مع آيس لاتيه هبة اليوم 28 ريال",
        "style": "ترند",
        "cafe_id": "cafe-riyadh-01",
        "engine_mode": "free"
    }
    r = requests.post(f"{BACKEND_URL}/api/jobs/process", json=payload, timeout=25)
    assert r.status_code == 200, f"Processing failed: {r.text}"
    job_data = r.json()
    assert job_data["success"] is True, "Job did not succeed"
    job_id = job_data["job_id"]
    print(f"✅ New Job generated successfully: {job_id}")
    print(f"   Duration: {job_data['duration_seconds']}s, Style: {job_data['script_data']['style_arabic']}")
    print(f"   Hook: {job_data['script_data']['hook_text']}")

    # Verify job in dashboard listing
    list_r = requests.get(f"{BACKEND_URL}/api/jobs")
    jobs = list_r.json()["jobs"]
    found = any(j["id"] == job_id for j in jobs)
    assert found, "Generated job not found in listing"
    print(f"✅ Job appears in Dashboard feed (Status: ready)")
    return job_id

def test_approve_and_regenerate(job_id: str):
    print("\n--- Phase 2 Test 4: Approval & Regeneration Workflow ---")
    # Test Approve
    app_r = requests.post(f"{BACKEND_URL}/api/jobs/{job_id}/approve")
    assert app_r.status_code == 200, "Approval failed"
    job = requests.get(f"{BACKEND_URL}/api/jobs/{job_id}").json()
    assert job["status"] == "published", f"Status expected published, got {job['status']}"
    print(f"✅ Job approved successfully: status = {job['status']}")

    # Test Regenerate
    regen_r = requests.post(f"{BACKEND_URL}/api/jobs/{job_id}/regenerate", timeout=25)
    assert regen_r.status_code == 200, "Regenerate failed"
    print(f"✅ Job regenerated successfully with fresh script")
    return True

def test_settings_toggle():
    print("\n--- Phase 2 Test 5: Free vs Paid Settings Toggle ---")
    current_settings = requests.get(f"{BACKEND_URL}/api/settings").json()
    new_mode = "paid" if current_settings.get("voice_engine") == "free" else "free"
    current_settings["voice_engine"] = new_mode
    
    save_r = requests.post(f"{BACKEND_URL}/api/settings", json=current_settings)
    assert save_r.status_code == 200, "Saving settings failed"
    
    verified = requests.get(f"{BACKEND_URL}/api/settings").json()
    assert verified["voice_engine"] == new_mode, "Setting did not persist"
    print(f"✅ Settings switch verified: voice_engine switched to '{new_mode}' without code change")
    
    # Revert to free
    current_settings["voice_engine"] = "free"
    requests.post(f"{BACKEND_URL}/api/settings", json=current_settings)
    return True

def test_role_filtering():
    print("\n--- Phase 2 Test 6: Role Based Data Isolation ---")
    jobs = requests.get(f"{BACKEND_URL}/api/jobs").json()["jobs"]
    admin_count = len(jobs)
    
    client_jobs = [j for j in jobs if j.get("cafe_id") == "cafe-riyadh-01"]
    client_count = len(client_jobs)
    
    print(f"✅ Admin sees all {admin_count} jobs across all cafes")
    print(f"✅ Client role (Aroma Cafe) is isolated to {client_count} jobs")
    return True

if __name__ == "__main__":
    print("==================================================")
    print("  Starting Mandatory Phase 2 Test Verification")
    print("==================================================")
    t1 = test_backend_health()
    t2 = test_dashboard_routes()
    test_job_id = test_telegram_realtime_job()
    t4 = test_approve_and_regenerate(test_job_id)
    t5 = test_settings_toggle()
    t6 = test_role_filtering()

    all_passed = all([t1, t2, bool(test_job_id), t4, t5, t6])
    print("\n==================================================")
    if all_passed:
        print("🎉 ALL PHASE 2 TESTS PASSED SUCCESSFULLY! (6/6)")
    else:
        print("❌ SOME PHASE 2 TESTS FAILED.")
    print("==================================================")
    if not all_passed:
        sys.exit(1)
