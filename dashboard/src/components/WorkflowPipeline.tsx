'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Cloud, 
  Brain, 
  Film, 
  Mic2, 
  Cpu, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export const WorkflowPipeline: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      num: 1,
      name: 'مستقبل تليجرام',
      nameEn: 'Telegram Trigger',
      icon: Send,
      tool: 'Telegram Bot API',
      status: 'active',
      desc: 'استقبال صور المشروب (1-3 صور) من صاحب الكافيه مع الكابشن والنمط المفضل.',
      detail: 'يدعم استلام الصور الأصلية بدقة عالية، وتحديد النمط المطلوب (مرِح، أستيتيك، تريند) مع رسالة تأكيد فورية للمستخدم.',
      cost: 'مجاني 100%',
      latency: '0.4s'
    },
    {
      num: 2,
      name: 'التخزين وقاعدة البيانات',
      nameEn: 'Supabase Media Storage',
      icon: Cloud,
      tool: 'Supabase Storage & PostgreSQL',
      status: 'active',
      desc: 'حفظ الصور وإنشاء سجل Job جديد بحالة "received".',
      detail: 'تخزين مشفر في السحابة مع رابط وصول مباشر وتسجيل مؤقتات المعالجة.',
      cost: 'مجاني (1 GB)',
      latency: '0.8s'
    },
    {
      num: 3,
      name: 'كتابة السكريبت الشبابي',
      nameEn: 'Gemini AI Scripting',
      icon: Brain,
      tool: 'Gemini 1.5 Flash (بديل: Groq / OpenRouter)',
      status: 'active',
      desc: 'صياغة هوك قوي وأسلوب سعودي شبابي عفوي مع كابشنات المنصات.',
      detail: 'مخرج JSON منظم: نص التعليق الصوتي، توقيتات الترجمة، كابشن لكل منصة (TikTok, Reels, Snapchat, Facebook)، وهاشتاجات محلية.',
      cost: 'مجاني (1500 طلب/يوم)',
      latency: '1.2s'
    },
    {
      num: 4,
      name: 'حركة الكاميرا 9:16',
      nameEn: 'Ken Burns Engine',
      icon: Film,
      tool: 'FFmpeg Motion (بديل احتياطي: Kling/Luma)',
      status: 'active',
      desc: 'تحويل الصور الثابتة إلى مشاهد فيديو عمودية بحركة زوم ديناميكية.',
      detail: 'تكبير ناعم وسلس (Zoom-in, Pan-up) بدقة 1080x1920 بمعدل 30 إطار/ثانية متناسقة مع إيقاع المشروب.',
      cost: 'مجاني 100% غير محدود',
      latency: '4.2s'
    },
    {
      num: 5,
      name: 'التعليق الصوتي السعودي',
      nameEn: 'Saudi Voiceover Engine',
      icon: Mic2,
      tool: 'Edge-TTS Saudi (بديل: ElevenLabs)',
      status: 'active',
      desc: 'توليد صوت سعودي نقي وطبيعي (صوت حامد / زارية).',
      detail: 'نطق سليم بدون أي نبرة آلية مصطنعة، مع ضبط دقيق لسرعة الإلقاء الشبابية والحيوية.',
      cost: 'مجاني 100% غير محدود',
      latency: '2.1s'
    },
    {
      num: 6,
      name: 'التجميع والرندرة الفورية',
      nameEn: 'FFmpeg Video Assembly',
      icon: Cpu,
      tool: 'FFmpeg Composite Engine',
      status: 'active',
      desc: 'دمج المقاطع والصوت والموسيقى الإيقاعية والترجمة العربية بخط عريض.',
      detail: 'إخراج ملف MP4 بنسبة 9:16 جاهز للتداول بجودة احترافية وترجمة بخط Tahoma/GeezaPro الواضح.',
      cost: 'مجاني 100%',
      latency: '5.8s'
    },
    {
      num: 7,
      name: 'التسليم والموافقة',
      nameEn: 'Delivery & One-Click Review',
      icon: CheckCircle,
      tool: 'Telegram Inline Buttons',
      status: 'active',
      desc: 'إرسال الفيديو والكابشن مع زري "موافقة ✅" و"إعادة 🔁".',
      detail: 'عند ضغط "موافقة" يتم التجهيز للنشر التلقائي، وعند "إعادة" يعاد توليد السكريبت بأسلوب مختلف فوراً.',
      cost: 'مجاني 100%',
      latency: '0.3s'
    },
    {
      num: 8,
      name: 'حارس الأخطاء والبدائل',
      nameEn: 'Fallback & Error Guard',
      icon: ShieldAlert,
      tool: 'Error Trigger & Auto-Retry',
      status: 'active',
      desc: 'إعادة المحاولة مرتين تلقائياً والتحويل للبديل المجاني إذا تعثرت الأداة الأساسية.',
      detail: 'ضمان عدم توقف المنظومة أبداً وتحديث حالة الـ Job وإرسال تنبيه بالخطأ إن وُجد.',
      cost: 'حماية ذاتية مجانية',
      latency: 'فوري'
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-[#14110E] border border-white/[0.08] shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-[#C28751]/20 text-[#DDA15E]">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              مخطط سير العمل المباشر في n8n (المرحلة الأولى - إنتاج المحتوى)
            </h3>
          </div>
          <p className="text-xs text-[#A89F91]">
            دورة مؤتمتة بالكامل من لحظة إرسال الصورة على تليجرام وحتى تسليم الفيديو الجاهز خلال ~14.8 ثانية
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 مراحل نشطة 100%</span>
          </span>
        </div>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {steps.map((step) => {
          const Icon = step.icon;
          const isExpanded = expandedStep === step.num;

          return (
            <div
              key={step.num}
              onClick={() => setExpandedStep(isExpanded ? null : step.num)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isExpanded
                  ? 'bg-[#1C1713] border-[#C28751]/50 shadow-lg shadow-[#C28751]/10'
                  : 'bg-[#181411] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#1A1613]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#C28751]/20 text-[#DDA15E] text-[10px] font-black flex items-center justify-center">
                    {step.num}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {step.name}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/[0.04] text-[#C28751]">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-[11px] text-[#A89F91] leading-relaxed line-clamp-2 mb-2.5">
                {step.desc}
              </div>

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px]">
                <span className="text-stone-400 font-medium truncate max-w-[120px]">
                  {step.tool}
                </span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {step.latency}
                </span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/[0.08] text-[11px] space-y-1.5 animate-fade-in text-[#D6CEC4]">
                  <p className="leading-relaxed">{step.detail}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#C28751] font-semibold pt-1">
                    <span>التكلفة: {step.cost}</span>
                    <span>الوضع: تلقائي بالكامل</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
