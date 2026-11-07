export type JobStatus = 
  | 'received' 
  | 'scripting' 
  | 'video' 
  | 'voice' 
  | 'rendering' 
  | 'ready' 
  | 'published' 
  | 'failed'
  | 'retrying';

export interface ScriptData {
  hook_text: string;
  voiceover_text: string;
  estimated_duration: number;
  style: string;
  style_arabic: string;
  subtitles: Array<{ text: string; start: number; end: number }>;
  captions: {
    tiktok: string;
    reels: string;
    snapchat: string;
    facebook: string;
  };
  hashtags: string[];
}

export interface Job {
  id: string;
  cafe_id: string;
  telegram_chat_id?: string;
  original_images: string[];
  user_caption?: string;
  style: string;
  status: JobStatus;
  script_data?: ScriptData;
  audio_url?: string;
  video_url?: string;
  video_stream_url?: string;
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface Cafe {
  id: string;
  name: string;
  city: string;
  logo_url?: string;
  brand_primary_color: string;
  brand_secondary_color: string;
  tone_of_voice: string;
  default_voice: string;
  default_style: string;
  instagram_handle?: string;
  tiktok_handle?: string;
}

export interface QuotaItem {
  service: string;
  label: string;
  period: string;
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  is_warning: boolean;
  is_exhausted: boolean;
  estimated_remaining_videos: number;
}

export interface QuotasResponse {
  quotas: Record<string, QuotaItem>;
  warnings: string[];
  has_warnings: boolean;
  timestamp: string;
}

export interface SystemSettings {
  script_engine: 'free' | 'paid';
  video_engine: 'free' | 'paid';
  voice_engine: 'free' | 'paid';
  voice_gender: 'male' | 'female';
  default_style: 'مرِح' | 'أستيتيك' | 'ترند';
  auto_publish: boolean;
  warning_threshold: number;
}
