-- =========================================================================
-- Initial Seed Data for Saudi Youth Cafe System
-- =========================================================================

-- 1. Initial Saudi Cafes
INSERT INTO public.cafes (id, name, city, brand_primary_color, brand_secondary_color, tone_of_voice, default_voice, default_style, instagram_handle, tiktok_handle)
VALUES 
(
    'cafe-riyadh-01',
    'كافيه أروما الرياض (Aroma Roastery)',
    'الرياض - حي النخيل',
    '#EAB308',
    '#18181B',
    'لهجة سعودية شبابية رايقة وخفيفة ("يسرسح"، "على جوك")',
    'ar-SA-HamedNeural',
    'مرِح',
    '@aroma_riyadh',
    '@aroma.cafe'
),
(
    'cafe-jeddah-02',
    'كافيه موج البحر (Wave Cafe)',
    'جدة - طريق الكورنيش',
    '#06B6D4',
    '#0F172A',
    'أستيتيك هادي ورايق مع تفاصيل القهوة المختصة',
    'ar-SA-ZariyahNeural',
    'أستيتيك',
    '@wave_jeddah',
    '@wave.coffee'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Initial Usage Quota Limits
INSERT INTO public.usage_quotas (service, label, period, limit_value, current_usage, warning_threshold)
VALUES
('gemini_daily_requests', 'Gemini API 1.5 Flash (طلبات يومية)', 'daily', 1500, 7, 0.8),
('elevenlabs_monthly_chars', 'ElevenLabs Arabic TTS (حروف شهريًا)', 'monthly', 10000, 0, 0.8),
('ai_video_monthly_clips', 'Kling / Luma AI Video (فيديوهات شهريًا)', 'monthly', 60, 0, 0.8),
('supabase_storage_mb', 'Supabase Media Storage (ميجابايت)', 'fixed', 1000, 15, 0.8),
('ffmpeg_renders', 'FFmpeg Ken Burns Engine (محلي مفتوح المصدر)', 'monthly', 999999, 7, 0.8),
('edge_tts_chars', 'Microsoft Edge-TTS Saudi (مجاني غير محدود)', 'monthly', 999999, 975, 0.8)
ON CONFLICT (service) DO NOTHING;

-- 3. Initial App Settings (Free vs Paid Switcher)
INSERT INTO public.app_settings (key, value, description)
VALUES
(
    'pipeline_engine_config',
    '{
        "script_engine": "free",
        "video_engine": "free",
        "voice_engine": "free",
        "voice_gender": "male",
        "default_style": "مرِح",
        "auto_publish_reels": false,
        "auto_publish_tiktok": false
    }'::jsonb,
    'إعدادات التبديل بين الأدوات المجانية والمدفوعة'
)
ON CONFLICT (key) DO NOTHING;
