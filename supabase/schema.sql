-- =========================================================================
-- Supabase Schema for Saudi Youth Cafe Video Automation
-- Includes Cafes, Jobs, Quotas, Settings, and Multi-tenant RLS Policies
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CAFES TABLE (Multi-tenant)
CREATE TABLE IF NOT EXISTS public.cafes (
    id TEXT PRIMARY KEY DEFAULT ('cafe-' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    city TEXT DEFAULT 'الرياض',
    logo_url TEXT,
    brand_primary_color TEXT DEFAULT '#F59E0B',
    brand_secondary_color TEXT DEFAULT '#1E1B18',
    tone_of_voice TEXT DEFAULT 'شبابي سعودي خفيف ومرح',
    default_voice TEXT DEFAULT 'ar-SA-HamedNeural',
    default_style TEXT DEFAULT 'مرِح',
    instagram_handle TEXT,
    tiktok_handle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. JOBS TABLE (Realtime enabled)
CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    cafe_id TEXT REFERENCES public.cafes(id) ON DELETE CASCADE,
    telegram_chat_id TEXT,
    original_images JSONB DEFAULT '[]'::jsonb,
    user_caption TEXT,
    style TEXT DEFAULT 'مرِح',
    status TEXT NOT NULL DEFAULT 'received',
    script_data JSONB,
    audio_url TEXT,
    video_url TEXT,
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_jobs_cafe_id ON public.jobs(cafe_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);

-- Enable Realtime on jobs
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;

-- 3. USAGE QUOTAS TABLE
CREATE TABLE IF NOT EXISTS public.usage_quotas (
    id SERIAL PRIMARY KEY,
    service TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    period TEXT NOT NULL, -- 'daily', 'monthly', 'fixed'
    limit_value INT NOT NULL,
    current_usage INT DEFAULT 0,
    warning_threshold REAL DEFAULT 0.8,
    is_exhausted BOOLEAN DEFAULT FALSE,
    last_reset TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SYSTEM SETTINGS (Free vs Paid switcher)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for Cafes
CREATE POLICY "Admins can do everything on cafes"
    ON public.cafes
    FOR ALL
    USING (public.is_admin());

CREATE POLICY "Cafe owners can view and edit their own cafe"
    ON public.cafes
    FOR ALL
    USING (auth.uid()::text = id OR public.is_admin());

-- Policies for Jobs
CREATE POLICY "Admins can do everything on jobs"
    ON public.jobs
    FOR ALL
    USING (public.is_admin());

CREATE POLICY "Clients can view and manage their cafe jobs"
    ON public.jobs
    FOR ALL
    USING (cafe_id = (SELECT id FROM public.cafes WHERE id = auth.uid()::text) OR public.is_admin());

-- Storage Bucket configuration for media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cafe-media', 'cafe-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public media access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'cafe-media');

CREATE POLICY "Authenticated users can upload media"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'cafe-media');
