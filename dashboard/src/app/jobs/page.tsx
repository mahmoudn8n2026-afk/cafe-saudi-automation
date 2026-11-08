'use client';

import React, { useEffect, useState } from 'react';
import { 
  Video, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  Play, 
  X, 
  Sparkles, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Film
} from 'lucide-react';
import { fetchJobs, approveJob, regenerateJob } from '@/lib/api';
import { Job } from '@/lib/types';
import { useRole } from '../ClientLayout';

export default function JobsPage() {
  const { role } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoJob, setSelectedVideoJob] = useState<Job | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data.jobs);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApprove = async (jobId: string) => {
    await approveJob(jobId);
    await loadJobs();
  };

  const handleRegenerate = async (jobId: string) => {
    await regenerateJob(jobId);
    await loadJobs();
  };

  // Role filtering
  const filteredByRole = role === 'admin' 
    ? jobs 
    : jobs.filter(j => j.cafe_id === 'cafe-riyadh-01');

  // Search and status filter
  const displayedJobs = filteredByRole.filter(j => {
    const matchesSearch = 
      (j.user_caption || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.script_data?.hook_text || '').toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Video className="w-7 h-7 text-[#C28751]" />
            <span>سجل الفيديوهات والمحتوى المؤتمت</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            متابعة حالة جميع الفيديوهات من مرحلة الاستقبال وحتى النشر النهائي على تيك توك وريلز
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-stone-300">
            إجمالي الفيديوهات: {displayedJobs.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14110E] p-3 rounded-2xl border border-white/[0.08]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المشروب، الهوك، أو المعرّف..."
            className="w-full ps-10 pe-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#C28751] transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'ready', label: 'جاهز للموافقة ✅' },
            { id: 'published', label: 'تم النشر 🚀' },
            { id: 'failed', label: 'فشل / إعادة ⚠️' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === st.id
                  ? 'bg-[#C28751] text-white shadow'
                  : 'bg-white/5 text-stone-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedJobs.map((job) => (
          <div
            key={job.id}
            className="flex flex-col justify-between rounded-3xl bg-[#14110E] border border-white/[0.08] overflow-hidden transition-all hover:border-[#C28751]/40 hover:shadow-xl"
          >
            <div>
              {/* Thumbnail / Video Preview Area */}
              <div className="relative h-48 bg-stone-900 overflow-hidden">
                <img
                  src={job.original_images[0] || '/images/iced_v60.jpg'}
                  alt={job.user_caption || 'Video Thumbnail'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 start-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow ${
                    job.status === 'published'
                      ? 'bg-blue-600 text-white'
                      : job.status === 'ready'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                  }`}>
                    {job.status === 'published' && 'تم النشر'}
                    {job.status === 'ready' && 'جاهز للموافقة'}
                    {job.status === 'failed' && 'فشل'}
                  </span>
                </div>

                {/* Style Badge */}
                <span className="absolute top-3 end-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-[#E8A858] font-bold border border-white/10">
                  نمط: {job.style}
                </span>

                {/* Quick Watch Button */}
                <button
                  onClick={() => setSelectedVideoJob(job)}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md group-hover:bg-[#C28751] text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-xl">
                    <Play className="w-5 h-5 fill-current ms-0.5" />
                  </div>
                </button>

                <div className="absolute bottom-3 start-3 end-3">
                  <h3 className="font-bold text-sm text-white drop-shadow truncate">
                    {job.user_caption || 'مشروب القهوة المختصة'}
                  </h3>
                </div>
              </div>

              {/* Job Body */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                  "{job.script_data?.hook_text || job.script_data?.voiceover_text}"
                </p>

                <div className="flex flex-wrap gap-1 text-[10px] text-stone-400">
                  <span className="px-2 py-0.5 rounded bg-white/5">
                    المدة: {job.script_data?.estimated_duration || 19.5}ث
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5">
                    صور: {job.original_images.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5">
                    {new Date(job.created_at).toLocaleTimeString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 pt-0 border-t border-white/[0.06] mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {job.status !== 'published' && (
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                    title="موافقة ونشر"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleRegenerate(job.id)}
                  className="p-2 rounded-xl bg-white/5 text-amber-400 hover:bg-white/10 transition"
                  title="إعادة التوليد"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(job.script_data?.captions.tiktok || '', job.id)}
                  className="p-2 rounded-xl bg-white/5 text-[#E8A858] hover:bg-white/10 transition"
                  title="نسخ كابشن تيك توك"
                >
                  {copiedKey === job.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <button
                onClick={() => setSelectedVideoJob(job)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C28751] text-white text-xs font-semibold hover:bg-[#A8703E] transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>مشاهدة</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideoJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedVideoJob(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#181411] rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideoJob(null)}
              className="absolute top-4 end-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-3 truncate">
              {selectedVideoJob.user_caption}
            </h3>

            <div className="relative aspect-[9/16] max-h-[60vh] mx-auto rounded-2xl overflow-hidden bg-black mb-4">
              <video
                src={selectedVideoJob.video_url || '/saudi_cafe_masterpiece.mp4'}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-stone-400">
                النمط: {selectedVideoJob.style} • الدقة: 1080x1920 (9:16)
              </span>

              <a
                href={selectedVideoJob.video_url || '/saudi_cafe_masterpiece.mp4'}
                download="saudi_cafe_video.mp4"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C28751] text-white text-xs font-bold hover:bg-[#A8703E]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل MP4</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
