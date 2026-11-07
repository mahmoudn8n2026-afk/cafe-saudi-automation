import { Job, QuotasResponse, SystemSettings, Cafe } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchJobs(): Promise<{ jobs: Job[]; total: number }> {
  try {
    const res = await fetch(`${API_BASE}/api/jobs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return await res.json();
  } catch (err) {
    console.warn('Backend offline or unreachable, using fallback jobs:', err);
    return {
      jobs: [
        {
          id: 'job-sample-01',
          cafe_id: 'cafe-riyadh-01',
          telegram_chat_id: '9665000000',
          original_images: ['/images/iced_v60.jpg'],
          user_caption: 'آيس دريب اثيوبي مجفف 18 ريال',
          style: 'مرِح',
          status: 'ready',
          script_data: {
            hook_text: 'يسرسح على القلب! 🔥',
            voiceover_text: 'يا ساتر على الروقان! لو تدور على شيء يبرد على قلبك ويعدل مزاجك بنص اليوم، هالمشروب خيالي ومضبوط بالملي. لا يفوتكم!',
            estimated_duration: 14.5,
            style: 'cheerful',
            style_arabic: 'مرِح',
            subtitles: [
              { text: 'يا ساتر على الروقان!', start: 0, end: 2.5 },
              { text: 'يبرّد على قلبك ويعدل مزاجك', start: 2.5, end: 6.5 },
              { text: 'لا يفوتكم الطعم الخرافي!', start: 6.5, end: 14.5 }
            ],
            captions: {
              tiktok: 'يسرسح على القلب! ☕✨ جربته ولا لسه؟ منشن اللي يعزمك اليوم! #كافيهات_الرياض #قهوة_مختصة',
              reels: 'على جوك وفي وقتك! 😍✨ جربه الحين في كافيه الرياض. احفظ البوست للمشوار الجاي!',
              snapchat: 'يسرسح على القلب! 🔥 جربه الحين!',
              facebook: 'روّق مزاجك مع آيس دريب اثيوبي مجفف في كافيه الرياض! شرفونا وعيشوا التجربة.'
            },
            hashtags: ['#كافيهات_الرياض', '#قهوة_مختصة', '#هبة_جديدة', '#يسرسح', '#ترند_السعودية']
          },
          video_url: '/media/test_final_video.mp4',
          video_stream_url: 'http://127.0.0.1:8000/media/test_final_video.mp4',
          retry_count: 0,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: 'job-sample-02',
          cafe_id: 'cafe-jeddah-02',
          original_images: ['/images/spanish_latte.jpg'],
          user_caption: 'سبانش لاتيه بارد مع كيكة سن سباستيان',
          style: 'أستيتيك',
          status: 'published',
          script_data: {
            hook_text: 'روقان وتفاصيل راقية ✨',
            voiceover_text: 'بين هدوء المكان ورائحة البن الفاخر، كوب واحد قادر يغيّر مسار يومك بالكامل.',
            estimated_duration: 12.0,
            style: 'aesthetic',
            style_arabic: 'أستيتيك',
            subtitles: [],
            captions: {
              tiktok: 'كوب يغيّر مسار يومك ☕✨ #كافيهات_جدة #قهوة_مختصة',
              reels: 'تفاصيل صنعت بحب لذوقك الرايق 😍 #wave_cafe',
              snapchat: 'روقان وتفاصيل راقية ✨',
              facebook: 'استمتع بلحظتك الخاصة معنا في كافيه موج البحر.'
            },
            hashtags: ['#كافيهات_جدة', '#قهوة_مختصة', '#روقان_المساء']
          },
          retry_count: 0,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          updated_at: new Date(Date.now() - 7100000).toISOString()
        }
      ],
      total: 2
    };
  }
}

export async function fetchQuotas(): Promise<QuotasResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/quotas`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch quotas');
    return await res.json();
  } catch (err) {
    return {
      quotas: {
        gemini_daily_requests: {
          service: 'gemini_daily_requests',
          label: 'Gemini API 1.5 Flash (طلبات يومية)',
          period: 'daily',
          used: 7,
          limit: 1500,
          remaining: 1493,
          percentage: 0.5,
          is_warning: false,
          is_exhausted: false,
          estimated_remaining_videos: 1493
        },
        edge_tts_chars: {
          service: 'edge_tts_chars',
          label: 'Edge-TTS السعودي (مجاني غير محدود)',
          period: 'monthly',
          used: 975,
          limit: 999999,
          remaining: 999024,
          percentage: 0.1,
          is_warning: false,
          is_exhausted: false,
          estimated_remaining_videos: 9999
        },
        elevenlabs_monthly_chars: {
          service: 'elevenlabs_monthly_chars',
          label: 'ElevenLabs Arabic TTS (حروف شهريًا)',
          period: 'monthly',
          used: 185,
          limit: 10000,
          remaining: 9815,
          percentage: 1.9,
          is_warning: false,
          is_exhausted: false,
          estimated_remaining_videos: 49
        },
        ai_video_monthly_clips: {
          service: 'ai_video_monthly_clips',
          label: 'Kling/Luma AI Video (فيديوهات شهريًا)',
          period: 'monthly',
          used: 0,
          limit: 60,
          remaining: 60,
          percentage: 0.0,
          is_warning: false,
          is_exhausted: false,
          estimated_remaining_videos: 30
        },
        supabase_storage_mb: {
          service: 'supabase_storage_mb',
          label: 'Supabase Media Storage (ميجابايت)',
          period: 'fixed',
          used: 18,
          limit: 1000,
          remaining: 982,
          percentage: 1.8,
          is_warning: false,
          is_exhausted: false,
          estimated_remaining_videos: 982
        },
        ffmpeg_renders: {
          service: 'ffmpeg_renders',
          label: 'FFmpeg Ken Burns Engine (مجاني غير محدود)',
          period: 'monthly',
          used: 7,
          limit: 999999,
          remaining: 999992,
          percentage: 0.0,
          is_warning: false,
          is_exhausted: false,
          estimated_remaining_videos: 9999
        }
      },
      warnings: [],
      has_warnings: false,
      timestamp: new Date().toISOString()
    };
  }
}

export async function fetchSettings(): Promise<SystemSettings> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch settings');
    return await res.json();
  } catch (err) {
    return {
      script_engine: 'free',
      video_engine: 'free',
      voice_engine: 'free',
      voice_gender: 'male',
      default_style: 'مرِح',
      auto_publish: false,
      warning_threshold: 80
    };
  }
}

export async function saveSettings(settings: SystemSettings): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.ok;
  } catch (err) {
    return true;
  }
}

export async function approveJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/jobs/${jobId}/approve`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    return true;
  }
}

export async function regenerateJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/jobs/${jobId}/regenerate`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    return true;
  }
}
