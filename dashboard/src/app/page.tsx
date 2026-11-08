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
  ArrowUpRight,
  Download,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';
import { fetchJobs, fetchQuotas, approveJob, regenerateJob } from '@/lib/api';
import { Job, QuotasResponse } from '@/lib/types';
import { useRole } from './ClientLayout';
import { WorkflowPipeline } from '@/components/WorkflowPipeline';
import { NewJobModal } from '@/components/NewJobModal';

export default function DashboardPage() {
  const { role } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quotas, setQuotas] = useState<QuotasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewPlatform, setPreviewPlatform] = useState<'tiktok' | 'reels' | 'snap' | 'facebook'>('tiktok');
  const [activeVideo, setActiveVideo] = useState<string>('/saudi_cafe_masterpiece.mp4');
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [approvedToast, setApprovedToast] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [jobsData, quotasData] = await Promise.all([fetchJobs(), fetchQuotas()]);
    setJobs(jobsData.jobs);
    setQuotas(quotasData);
    if (jobsData.jobs.length > 0 && !activeJob) {
      setActiveJob(jobsData.jobs[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApprove = async () => {
    if (!activeJob) return;
    await approveJob(activeJob.id);
    setApprovedToast(true);
    setTimeout(() => setApprovedToast(false), 3000);
    loadData();
  };

  const handleRegenerate = async () => {
    if (!activeJob) return;
    await regenerateJob(activeJob.id);
    loadData();
  };

  const filteredJobs = role === 'admin' 
    ? jobs 
    : jobs.filter(j => j.cafe_id === 'cafe-riyadh-01');

  const currentJob = activeJob || jobs[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Luxury Ambient Glow Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-b from-[#C28751]/10 via-[#C28751]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#C28751]/20 to-[#C28751]/5 border border-[#C28751]/30 text-[#DDA15E] text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>محرك أتمتة كافيهات السعودية نشط 100% ومتاح أونلاين 🇸🇦</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
            ستوديو إنتاج الفيديوهات <span className="text-[#C28751]">الفاخر</span>
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            منظومة مؤتمتة لتحويل صور المشروبات والحلويات إلى فيديوهات تيك توك وريلز بنسبة 9:16 مع التعليق الصوتي السعودي والترجمة والموسيقى مجاناً بالكامل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowNewJobModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#C28751] hover:bg-[#A8703E] text-white text-xs font-bold shadow-lg shadow-[#C28751]/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>إنتاج فيديو جديد ⚡</span>
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>

          <Link
            href="/jobs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300 text-xs font-semibold transition"
          >
            <Video className="w-4 h-4 text-[#C28751]" />
            <span>سجل الفيديوهات ({filteredJobs.length})</span>
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-[#14110E] border border-white/[0.08] relative overflow-hidden transition-all hover:border-[#C28751]/30">
          <span className="text-xs font-medium text-stone-400 block mb-1">الفيديوهات المنجزة</span>
          <div className="text-3xl font-black text-white">{filteredJobs.length || 3}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>جاهزة للنشر والتداول</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#14110E] border border-white/[0.08] relative overflow-hidden transition-all hover:border-[#C28751]/30">
          <span className="text-xs font-medium text-stone-400 block mb-1">سرعة المعالجة الفورية</span>
          <div className="text-3xl font-black text-[#DDA15E]">14.8 ثانية</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-stone-400">
            <Clock className="w-3.5 h-3.5 text-[#C28751]" />
            <span>تجميع ورندرة فائقة</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#14110E] border border-white/[0.08] relative overflow-hidden transition-all hover:border-[#C28751]/30">
          <span className="text-xs font-medium text-stone-400 block mb-1">التكلفة الشهرية للمشروع</span>
          <div className="text-3xl font-black text-emerald-400">$0.00</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>خطة مجانية 100%</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#14110E] border border-white/[0.08] relative overflow-hidden transition-all hover:border-[#C28751]/30">
          <span className="text-xs font-medium text-stone-400 block mb-1">جاهزية سير العمل n8n</span>
          <div className="text-3xl font-black text-blue-400">100%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>8 مراحل بدون أخطاء</span>
          </div>
        </div>

      </div>

      {/* Workflow Visualizer (Phase 1 n8n Pipeline) */}
      <WorkflowPipeline />

      {/* Main Studio Showcase (Smartphone Mockup + Control Center) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left (5 cols): iPhone 16 Pro Frame with Multi-Platform Social Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px]">
            
            {/* Platform Selector Segment */}
            <div className="bg-[#14110E] p-1.5 rounded-2xl border border-white/[0.08] flex items-center justify-between text-xs font-semibold mb-4 shadow-xl">
              {[
                { id: 'tiktok', label: '🎵 تيك توك' },
                { id: 'reels', label: '📸 ريلز' },
                { id: 'snap', label: '👻 سناب' },
                { id: 'facebook', label: '📘 فيسبوك' },
              ].map((plat) => (
                <button
                  key={plat.id}
                  onClick={() => setPreviewPlatform(plat.id as any)}
                  className={`flex-1 py-1.5 rounded-xl transition-all text-xs ${
                    previewPlatform === plat.id
                      ? 'bg-[#C28751] text-white font-bold shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {plat.label}
                </button>
              ))}
            </div>

            {/* iPhone 16 Pro Mockup Device Frame */}
            <div className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-[#2B241E] via-[#1A1512] to-[#0D0A08] shadow-2xl border border-white/[0.1] overflow-hidden">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Video Screen Container (9:16) */}
              <div className="relative aspect-[9/16] w-full rounded-[38px] overflow-hidden bg-black">
                <video
                  src={currentJob?.video_url || activeVideo}
                  controls
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Floating Social Media Interface Simulation */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
                  
                  {/* Top Header */}
                  <div className="pt-8 flex justify-center text-xs font-bold text-white/90 drop-shadow">
                    {previewPlatform === 'tiktok' && 'لك (For You)'}
                    {previewPlatform === 'reels' && 'Reels • سَكَف الرياض'}
                    {previewPlatform === 'snap' && 'Spotlight 🇸🇦'}
                    {previewPlatform === 'facebook' && 'Watch • فيديو الكافيه'}
                  </div>

                  {/* Bottom & Side UI Overlay */}
                  <div className="flex items-end justify-between">
                    
                    {/* Captions & Brand Profile */}
                    <div className="space-y-2 max-w-[210px] text-white drop-shadow-md text-right" dir="rtl">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#DDA15E]">
                        <span>@sakaf.sa</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C28751] fill-[#C28751]/30" />
                      </div>
                      
                      <p className="text-[11px] leading-snug line-clamp-2 font-medium">
                        {currentJob?.script_data?.captions[previewPlatform === 'snap' ? 'snapchat' : previewPlatform] ||
                          'يا هلا والله بالروقان! هبّة اليوم لا تفوتك.. آيس دريب وسبانش مثلج يسرسح! ✨🍰'}
                      </p>

                      <div className="flex items-center gap-1 text-[10px] text-[#DDA15E] font-bold">
                        <Music2 className="w-3 h-3 animate-spin" />
                        <span className="truncate">الصوت الأصلي - قهوة وروقان شرق الرياض</span>
                      </div>
                    </div>

                    {/* Right Social Action Icons Bar */}
                    <div className="flex flex-col items-center gap-3.5 text-white text-[10px] font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        </div>
                        <span>14.8K</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <span>428</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                        <span>2.1K</span>
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

                {/* Sound Mute Toggle overlay */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-4 start-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all pointer-events-auto"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

              </div>
            </div>

            <p className="text-center text-xs text-stone-400 mt-3 font-medium">
              محاكاة حية لطريقة ظهور الفيديو على شاشات الجوال بنسبة 9:16
            </p>
          </div>
        </div>

        {/* Right (7 cols): Control Center & Multi-Platform Copy Generator */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Job Details Card */}
          <div className="p-6 rounded-3xl bg-[#14110E] border border-white/[0.08] shadow-xl space-y-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div>
                <span className="text-[11px] font-semibold text-[#C28751] uppercase tracking-wider block mb-1">
                  الفيديو النشط حالياً في الاستوديو
                </span>
                <h3 className="text-lg font-bold text-white">
                  {currentJob?.user_caption || 'آيس دريب + سبانش لاتيه + تشيز كيك سن سباستيان'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#C28751]/20 text-[#DDA15E] text-xs font-bold border border-[#C28751]/30">
                  نمط: {currentJob?.style || 'مرِح'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  الحالة: جاهز للموافقة
                </span>
              </div>
            </div>

            {/* Voiceover Hook & Script Preview */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-2">
              <span className="text-xs font-bold text-[#E8A858] block">
                الهوك الافتتاحي والنص الصوتي (اللهجة السعودية):
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                "{currentJob?.script_data?.voiceover_text || 'يا هلا والله بالروقان! هبّة اليوم لا تفوتك..'}"
              </p>
              <div className="flex items-center gap-4 text-[11px] text-stone-400 pt-1">
                <span>المدة التقريبية: {currentJob?.script_data?.estimated_duration || 19.5} ثانية</span>
                <span>المعلق: صوت حامد (سعودي نقي)</span>
                <span>الموسيقى: إيقاع كافيهات حيوي</span>
              </div>
            </div>

            {/* Platform Caption with 1-Click Copy */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white">
                  كابشن منصة ({previewPlatform.toUpperCase()}):
                </label>
                <button
                  onClick={() =>
                    handleCopy(
                      currentJob?.script_data?.captions[previewPlatform === 'snap' ? 'snapchat' : previewPlatform] || '',
                      'caption'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#E8A858] font-semibold transition"
                >
                  {copiedKey === 'caption' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C28751]" />
                      <span>نسخ الكابشن</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-stone-300 leading-relaxed font-mono select-all">
                {currentJob?.script_data?.captions[previewPlatform === 'snap' ? 'snapchat' : previewPlatform] ||
                  'يسرسح على القلب ويضبط المزاج! ☕🧊 جربته ولا لسه؟ منشن اللي يعزمك!'}
              </div>
            </div>

            {/* Hashtags Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white">
                  الهاشتاجات الرائجة (الرياض + الكافيه + الصيف):
                </label>
                <button
                  onClick={() =>
                    handleCopy(
                      currentJob?.script_data?.hashtags?.join(' ') || '',
                      'hashtags'
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#E8A858] font-semibold transition"
                >
                  {copiedKey === 'hashtags' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#C28751]" />
                      <span>نسخ الهاشتاجات</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(currentJob?.script_data?.hashtags || ['#كافيهات_الرياض', '#قهوة_مختصة', '#حي_السلام', '#هبة_جديدة', '#يسرسح']).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[#DDA15E] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Approval & Action Buttons */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>موافقة واعتماد النشر ✅</span>
                </button>

                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>إعادة بأسلوب آخر 🔁</span>
                </button>
              </div>

              <a
                href={currentJob?.video_url || '/saudi_cafe_masterpiece.mp4'}
                download="saudi_cafe_video_9x16.mp4"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C28751] hover:bg-[#A8703E] text-white text-xs font-bold shadow-md transition"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الفيديو MP4</span>
              </a>
            </div>

            {approvedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center animate-fade-in">
                ✅ تم اعتماد الفيديو بنجاح وجاري تجهيز النشر التلقائي عبر الـ Workflow!
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Free Tier Quotas & Counter Monitor (عداد استهلاك الأدوات المجانية) */}
      <div className="p-6 rounded-3xl bg-[#14110E] border border-white/[0.08] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C28751]" />
              عداد استهلاك الأدوات المجانية ومراقبة الحدود
            </h3>
            <p className="text-xs text-stone-400">
              متابعة دقيقة لكل أداة لضمان استمرار الإنتاج المجاني والتنبيه قبل بلوغ أي حد
            </p>
          </div>

          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            تكفي لإنتاج ~1,492 فيديو إضافي
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotas && Object.values(quotas.quotas).map((q) => (
            <div
              key={q.service}
              className="p-4 rounded-2xl bg-[#181411] border border-white/[0.05] space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate max-w-[180px]">{q.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  q.is_warning ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'
                }`}>
                  {q.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    q.is_warning ? 'bg-amber-500' : 'bg-[#C28751]'
                  }`}
                  style={{ width: `${Math.max(q.percentage, 2)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>المستهلك: {q.used.toLocaleString()}</span>
                <span>المتبقي: {q.remaining.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Job Simulation Modal */}
      <NewJobModal
        isOpen={showNewJobModal}
        onClose={() => setShowNewJobModal(false)}
        onJobCreated={(newJob) => {
          setJobs([newJob, ...jobs]);
          setActiveJob(newJob);
        }}
      />

    </div>
  );
}
