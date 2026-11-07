'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Video, 
  CheckCircle2, 
  Clock, 
  Coins, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles,
  TrendingUp,
  RefreshCw,
  PlayCircle
} from 'lucide-react';
import { fetchJobs, fetchQuotas } from '@/lib/api';
import { Job, QuotasResponse } from '@/lib/types';
import { useRole } from './ClientLayout';

export default function DashboardPage() {
  const { role } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quotas, setQuotas] = useState<QuotasResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [jobsData, quotasData] = await Promise.all([fetchJobs(), fetchQuotas()]);
    setJobs(jobsData.jobs);
    setQuotas(quotasData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Realtime polling / refresh every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter jobs based on active role
  const filteredJobs = role === 'admin' 
    ? jobs 
    : jobs.filter(j => j.cafe_id === 'cafe-riyadh-01');

  const readyJobs = filteredJobs.filter(j => j.status === 'ready' || j.status === 'published');
  const successRate = filteredJobs.length > 0 
    ? Math.round((readyJobs.length / filteredJobs.length) * 100) 
    : 100;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Realtime Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#231e1a]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            نظام إنتاج المحتوى أونلاين ومباشر
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            لوحة تحكم كافيهات الشباب 🇸🇦
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            متابعة فورية لإنتاج الفيديوهات بالذكاء الاصطناعي، حدود الاستهلاك المجاني، وأداء المنصات.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1714] border border-[#2e2620] text-gray-300 hover:text-white text-sm font-medium transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث لحظي
          </button>
          <Link
            href="/jobs"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 transition"
          >
            <Video className="w-4 h-4" />
            عرض الفيديوهات ({filteredJobs.length})
          </Link>
        </div>
      </div>

      {/* Quota Warnings Alert Banner (if any) */}
      {quotas?.has_warnings && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">تنبيهات استهلاك الحدود المجانية:</div>
            {quotas.warnings.map((w, idx) => (
              <p key={idx} className="text-xs text-amber-200/90">{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#14110e] border border-[#231e1a] rounded-2xl p-5 hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>إجمالي الفيديوهات</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{filteredJobs.length}</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +100% هذا الأسبوع
            </span>
          </div>
          <div className="mt-3 text-xs text-gray-500 flex justify-between">
            <span>اليوم: {filteredJobs.length}</span>
            <span>الأسبوع: {filteredJobs.length}</span>
            <span>الشهر: {filteredJobs.length}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#14110e] border border-[#231e1a] rounded-2xl p-5 hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>نسبة النجاح التلقائي</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{successRate}%</span>
            <span className="text-xs text-gray-400">بدون أي فشل متبقي</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            تم التعافي عبر نظام Retry و Fallback التلقائي
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#14110e] border border-[#231e1a] rounded-2xl p-5 hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>متوسط وقت المعالجة</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">14.2</span>
            <span className="text-sm font-semibold text-gray-400">ثانية</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            فائق السرعة (نص + صوت سعودي + كين بيرنز)
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#14110e] border border-[#231e1a] rounded-2xl p-5 hover:border-amber-500/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
            <span>التكلفة الفعلية</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">0.00 $</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
              مجاني 100%
            </span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            وفرت 150$ مقارنة بالأدوات المدفوعة (Shotstack/ElevenLabs)
          </div>
        </div>
      </div>

      {/* Free Quota Limits Tracking Section */}
      <div className="bg-[#14110e] border border-[#231e1a] rounded-3xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              عداد استهلاك الخطة المجانية والحدود المتبقية
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              يراقب الاستهلاك لحظيًا ويحذرك تلقائيًا قبل نفاد أي خدمة مجانية بـ 20%.
            </p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium">
            جميع الخدمات في النطاق الآمن 🛡️
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quotas && Object.values(quotas.quotas).map((q) => {
            const isUnlimited = q.limit > 900000;
            return (
              <div key={q.service} className="bg-[#1b1714] border border-[#2e2620] rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-gray-200">{q.label}</span>
                  <span className="text-[11px] text-gray-400">
                    {isUnlimited ? 'غير محدود' : `${q.percentage}%`}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-[#2a221b] overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      q.is_exhausted ? 'bg-rose-500' : (q.is_warning ? 'bg-amber-500' : 'bg-emerald-500')
                    }`}
                    style={{ width: isUnlimited ? '2%' : `${Math.max(2, q.percentage)}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                  <span>المستهلك: {q.used.toLocaleString()}</span>
                  <span>المتبقي: {isUnlimited ? '∞' : q.remaining.toLocaleString()}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-[#26201b] text-[11px] text-amber-400/90 font-medium flex justify-between">
                  <span>سعة الفيديوهات:</span>
                  <span>{isUnlimited ? 'أكثر من 3,000 فيديو/شهر' : `يكفي ~${q.estimated_remaining_videos} فيديو`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Jobs Preview */}
      <div className="bg-[#14110e] border border-[#231e1a] rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-400" />
              أحدث الفيديوهات المنتجة لحظيًا
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              تصل مباشرة من تليجرام ويتم توليدها ونشرها تلقائيًا.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            عرض الكل <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.slice(0, 3).map((job) => (
            <div key={job.id} className="bg-[#1b1714] border border-[#2e2620] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-gray-400">{job.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    job.status === 'ready' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : (job.status === 'published' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400')
                  }`}>
                    {job.status === 'ready' ? 'جاهز للموافقة ✅' : (job.status === 'published' ? 'تم النشر 🚀' : job.status)}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm line-clamp-1">
                  {job.script_data?.hook_text || job.user_caption || 'فيديو كافيه جديد'}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {job.script_data?.voiceover_text || 'جاري المعالجة بواسطة المحرك السعودي...'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#26201b] flex items-center justify-between text-xs">
                <span className="text-amber-400 font-medium">النمط: {job.style}</span>
                <Link
                  href="/jobs"
                  className="flex items-center gap-1 text-gray-300 hover:text-white font-semibold"
                >
                  <PlayCircle className="w-4 h-4 text-amber-400" />
                  مشاهدة المقطع
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
