'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Video, 
  CheckCircle2, 
  Clock, 
  Coins, 
  Sparkles,
  TrendingUp,
  RefreshCw,
  Play,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Music2,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { fetchJobs, fetchQuotas } from '@/lib/api';
import { Job, QuotasResponse } from '@/lib/types';
import { useRole } from './ClientLayout';

export default function DashboardPage() {
  const { role } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quotas, setQuotas] = useState<QuotasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewPlatform, setPreviewPlatform] = useState<'tiktok' | 'reels' | 'snap'>('tiktok');
  const [activeVideo, setActiveVideo] = useState<string>(
    '/output/premium_demo/saudi_cafe_premium_demo_9x16.mp4'
  );

  const loadData = async () => {
    setLoading(true);
    const [jobsData, quotasData] = await Promise.all([fetchJobs(), fetchQuotas()]);
    setJobs(jobsData.jobs);
    setQuotas(quotasData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredJobs = role === 'admin' 
    ? jobs 
    : jobs.filter(j => j.cafe_id === 'cafe-riyadh-01');

  return (
    <div className="space-y-10 pb-16">
      {/* Luxury Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>محرك الذكاء الاصطناعي لكافيهات الشباب نشط ومتاح أونلاين 🇸🇦</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            ستوديو أتمتة محتوى الكافيهات <span className="text-amber-400">الفاخر</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
            منظومة مؤتمتة لتحويل صور المشروبات والحلويات إلى فيديوهات تيك توك وريلز باللهجة السعودية الشبابية بنسبة 9:16 مع الترجمة والموسيقى بدون أي تكلفة شهرية.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#14110e] border border-white/[0.08] hover:border-amber-500/40 text-gray-300 hover:text-white text-xs font-semibold transition backdrop-blur-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            تحديث البيانات
          </button>
          <Link
            href="/jobs"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition"
          >
            <Video className="w-4 h-4" />
            معرض الفيديوهات ({filteredJobs.length})
          </Link>
        </div>
      </div>

      {/* Interactive Mobile Phone Simulator & Studio Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main: Live iPhone Mockup (9:16 Video Player with TikTok/Reels UI) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px]">
            {/* Platform Selector Tabs */}
            <div className="bg-[#14110e] p-1.5 rounded-2xl border border-white/[0.08] flex items-center justify-between text-xs font-semibold mb-4 shadow-xl">
              <button
                onClick={() => setPreviewPlatform('tiktok')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  previewPlatform === 'tiktok'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎵 تيك توك
              </button>
              <button
                onClick={() => setPreviewPlatform('reels')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  previewPlatform === 'reels'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📸 ريلز
              </button>
              <button
                onClick={() => setPreviewPlatform('snap')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  previewPlatform === 'snap'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                👻 سناب شات
              </button>
            </div>

            {/* iPhone 16 Pro Mockup Device Frame */}
            <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-[#2b241e] via-[#1a1512] to-[#0d0a08] shadow-2xl border border-white/[0.1] overflow-hidden">
              {/* Dynamic Island Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Video Screen Container (9:16) */}
              <div className="relative aspect-[9/16] w-full rounded-[38px] overflow-hidden bg-black">
                <video
                  src="http://127.0.0.1:8000/media/premium_demo/saudi_cafe_premium_demo_9x16.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* TikTok / Reels Floating Social Overlay UI */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
                  {/* Top Header */}
                  <div className="pt-8 flex justify-center text-xs font-bold text-white/90 drop-shadow">
                    {previewPlatform === 'tiktok' && 'لك (For You)'}
                    {previewPlatform === 'reels' && 'Reels • كافيه أروما'}
                    {previewPlatform === 'snap' && 'Spotlight 🇸🇦'}
                  </div>

                  {/* Bottom & Side UI Overlay */}
                  <div className="flex items-end justify-between">
                    {/* Captions & Brand Profile */}
                    <div className="space-y-2 max-w-[210px] text-white drop-shadow-md text-right" dir="rtl">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
                        <span>@aroma_riyadh</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                      </div>
                      <p className="text-[11px] leading-snug line-clamp-2 font-medium">
                        يا هلا والله بالروقان! هبّة اليوم لا تفوتك.. آيس دريب وسبانش يسرسح على قلبك مع سن سباستيان فاخرة! ✨🍰
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold">
                        <Music2 className="w-3 h-3 animate-spin" />
                        <span className="truncate">الصوت الأصلي - قهوة وروقان الرياض</span>
                      </div>
                    </div>

                    {/* Right Action Icons Bar */}
                    <div className="flex flex-col items-center gap-3.5 text-white text-[10px] font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        </div>
                        <span>14.2K</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <span>328</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                        <span>1.9K</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Share2 className="w-4 h-4 text-white" />
                        </div>
                        <span>إرسال</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-3 font-medium">
              محاكاة حية لطريقة ظهور الفيديو على شاشات الموبايل
            </p>
          </div>
        </div>

        {/* Right: Studio Metrics & Production Quality Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top 4 Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-[#13100d] border border-white/[0.08] rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">الفيديوهات الجاهزة</span>
              <div className="text-2xl font-black text-white">{filteredJobs.length}</div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 inline-flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> نشط 100%
              </span>
            </div>

            <div className="bg-[#13100d] border border-white/[0.08] rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">سرعة الرندرة</span>
              <div className="text-2xl font-black text-amber-400">14.8s</div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                تجميع فوري MP4
              </span>
            </div>

            <div className="bg-[#13100d] border border-white/[0.08] rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">التكلفة الإجمالية</span>
              <div className="text-2xl font-black text-emerald-400">$0.00</div>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                مجاني بالكامل
              </span>
            </div>

            <div className="bg-[#13100d] border border-white/[0.08] rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">نسبة التوفير</span>
              <div className="text-2xl font-black text-blue-400">100%</div>
              <span className="text-[10px] text-gray-400 font-medium mt-1 block">
                وفرت 150$/شهر
              </span>
            </div>
          </div>

          {/* Real Free Quotas Card */}
          <div className="bg-[#13100d] border border-white/[0.08] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  سعة الأدوات المجانية والاستهلاك اللحظي
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  تنبيه ذكي قبل نفاد أي حد مجاني، مع Fallback محلي تلقائي بدون توقف الخدمة.
                </p>
              </div>
              <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-xl font-bold">
                الحالة: ممتازة 🛡️
              </span>
            </div>

            <div className="space-y-3.5 pt-2">
              {/* Gemini Quota */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-semibold">Gemini Flash API (كتابة السكريبت والكابشن)</span>
                  <span className="text-amber-400 font-bold">1,493 طلب متبقي اليوم (من 1,500)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#201a14] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[2%]" />
                </div>
              </div>

              {/* Edge TTS Saudi Quota */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-semibold">Edge-TTS السعودي: حامد وزارية (التعليق الصوتي)</span>
                  <span className="text-emerald-400 font-bold">غير محدود (مجاني بالكامل)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#201a14] overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[1%]" />
                </div>
              </div>

              {/* FFmpeg Ken Burns Render */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-semibold">FFmpeg Ken Burns 9:16 (الرندرة والمونتاج)</span>
                  <span className="text-blue-400 font-bold">سعة غير محدودة على السيرفر المحلي</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#201a14] overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-[1%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-gradient-to-br from-[#1c1611] to-[#120e0a] border border-amber-500/20 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                تحميل مقطع الديمو الفاخر بجودة 1080x1920
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                تم إنتاج الفيديو بـ 3 منتجات حقيقية (V60، سبانش لاتيه، سن سباستيان) مع صوت سعودي وموسيقى هادئة.
              </p>
            </div>
            <a
              href="http://127.0.0.1:8000/media/premium_demo/saudi_cafe_premium_demo_9x16.mp4"
              download="saudi_cafe_premium_demo_9x16.mp4"
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shrink-0 flex items-center gap-2 transition"
            >
              <span>تحميل MP4 الآن</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Featured Production Feed */}
      <div className="bg-[#13100d] border border-white/[0.08] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-400" />
              سجل المقاطع المنتجة ومقارنة الأنماط الثلاثة
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              كل مقطع يتم ضبطه تلقائياً بنسبة 9:16 مع كابشن مخصص لتيك توك وإنستقرام وسناب شات.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
          >
            استعراض كافة المهام <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Cheerful */}
          <div className="bg-[#1a140f] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                  نمط مرِح وفرفشة
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">✅ جاهز للنشر</span>
              </div>
              <h4 className="font-extrabold text-white text-sm mb-1.5">
                يا ساتر على الروقان! هبّة اليوم لا تفوتك
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                آيس دريب وسبانش يسرسح على قلبك مع سن سباستيان تذوب بالفم.. منشن خويك وقول له اليوم على حسابك!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">المدة: 15 ثانية</span>
              <Link href="/jobs" className="text-amber-400 font-bold hover:underline">
                معاينة ونسخ الكابشن ←
              </Link>
            </div>
          </div>

          {/* Card 2: Aesthetic */}
          <div className="bg-[#1a140f] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                  نمط أستيتيك وهادي
                </span>
                <span className="text-[11px] text-blue-400 font-bold">🚀 منشور</span>
              </div>
              <h4 className="font-extrabold text-white text-sm mb-1.5">
                روقان وتفاصيل راقية تصنع يومك
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                بين هدوء المكان ورائحة البن الفاخر، كوب واحد قادر يغيّر مسار يومك بالكامل.. استمتع بلحظتك الخاصة.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">المدة: 14 ثانية</span>
              <Link href="/jobs" className="text-amber-400 font-bold hover:underline">
                معاينة ونسخ الكابشن ←
              </Link>
            </div>
          </div>

          {/* Card 3: Trend & Challenge */}
          <div className="bg-[#1a140f] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-500/20">
                  نمط ترند وتحدي
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">✅ جاهز للنشر</span>
              </div>
              <h4 className="font-extrabold text-white text-sm mb-1.5">
                الهبة اللي مكسرة الرياض.. اتحداك ما تطلبها!
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                طعم لا يقاوم وجودة ما تتقارن.. روح جرّب الحين وقيم بنفسك وشاركنا رأيك بالكومنتات!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">المدة: 13 ثانية</span>
              <Link href="/jobs" className="text-amber-400 font-bold hover:underline">
                معاينة ونسخ الكابشن ←
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
