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
  AlertCircle
} from 'lucide-react';
import { fetchJobs, approveJob, regenerateJob } from '@/lib/api';
import { Job } from '@/lib/types';
import { useRole } from '../ClientLayout';

export default function JobsPage() {
  const { role } = useRole();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Job | null>(null);
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
    const interval = setInterval(loadJobs, 8000);
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#231e1a]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-amber-400" />
            سجل الفيديوهات والمحتوى اللحظي
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            استعراض الفيديوهات المنتجة بنسبة 9:16، تحميلها، نسخ الكابشن لكل منصة، وإعادة التوليد.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-xl font-bold">
            {displayedJobs.length} مقطع جاهز
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باسم المشروب، الهوك، أو المعرّف..."
            className="w-full pl-4 pr-10 py-2.5 bg-[#14110e] border border-[#2e2620] rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#14110e] border border-[#2e2620] rounded-xl py-2.5 px-3 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="ready">جاهز للموافقة (Ready)</option>
            <option value="published">تم النشر (Published)</option>
            <option value="rendering">جاري الرندرة (Rendering)</option>
            <option value="failed">فشل (Failed)</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedJobs.map((job) => {
          const hook = job.script_data?.hook_text || job.user_caption || 'فيديو كافيه جديد';
          const voiceover = job.script_data?.voiceover_text || 'جاري المعالجة...';

          return (
            <div 
              key={job.id} 
              className="bg-[#14110e] border border-[#231e1a] rounded-3xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Media Header / Thumbnail */}
                <div className="relative h-48 bg-[#1e1915] flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  
                  {/* Decorative Video Mockup / Play overlay */}
                  <div className="relative z-20 flex flex-col items-center gap-2">
                    <button
                      onClick={() => setSelectedVideo(job)}
                      className="w-14 h-14 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:scale-110 transition"
                    >
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </button>
                    <span className="text-xs text-amber-200 font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      {job.script_data?.estimated_duration || 14} ثانية • 9:16
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-md shadow-md ${
                      job.status === 'ready' 
                        ? 'bg-emerald-500/80 text-black font-extrabold' 
                        : (job.status === 'published' ? 'bg-blue-500/80 text-white' : 'bg-amber-500/80 text-black')
                    }`}>
                      {job.status === 'ready' ? '✅ جاهز للنشر' : (job.status === 'published' ? '🚀 منشور' : job.status)}
                    </span>
                  </div>

                  {/* Style Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="bg-black/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg text-xs font-medium backdrop-blur-md">
                      {job.style}
                    </span>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">
                      {hook}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {voiceover}
                    </p>
                  </div>

                  {/* Platform Captions Copy Buttons */}
                  {job.script_data?.captions && (
                    <div className="pt-2 border-t border-[#231e1a] space-y-1.5">
                      <div className="text-[11px] text-gray-400 font-semibold mb-1">
                        نسخ الكابشن بنقرة واحدة:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleCopy(job.script_data!.captions.tiktok, `${job.id}-tt`)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1c1815] border border-[#2c241e] text-[11px] text-gray-300 hover:text-white hover:border-amber-500/40 transition"
                        >
                          <span>🎵 تيك توك</span>
                          {copiedKey === `${job.id}-tt` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                        </button>
                        <button
                          onClick={() => handleCopy(job.script_data!.captions.reels, `${job.id}-reels`)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1c1815] border border-[#2c241e] text-[11px] text-gray-300 hover:text-white hover:border-amber-500/40 transition"
                        >
                          <span>📸 ريلز</span>
                          {copiedKey === `${job.id}-reels` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                        </button>
                        <button
                          onClick={() => handleCopy(job.script_data!.captions.snapchat, `${job.id}-snap`)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1c1815] border border-[#2c241e] text-[11px] text-gray-300 hover:text-white hover:border-amber-500/40 transition"
                        >
                          <span>👻 سناب</span>
                          {copiedKey === `${job.id}-snap` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                        </button>
                        <button
                          onClick={() => handleCopy(job.script_data!.captions.facebook, `${job.id}-fb`)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1c1815] border border-[#2c241e] text-[11px] text-gray-300 hover:text-white hover:border-amber-500/40 transition"
                        >
                          <span>📘 فيسبوك</span>
                          {copiedKey === `${job.id}-fb` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-[#100e0c] border-t border-[#231e1a] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedVideo(job)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  مشاهدة
                </button>
                <button
                  onClick={() => handleRegenerate(job.id)}
                  title="إعادة التوليد بسكريبت جديد"
                  className="p-2 rounded-xl bg-[#1d1814] border border-[#2e2620] text-gray-300 hover:text-white text-xs hover:border-amber-500/40"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {job.status === 'ready' && (
                  <button
                    onClick={() => handleApprove(job.id)}
                    className="py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold"
                  >
                    موافقة ✅
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Playback Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14110e] border border-[#2e2620] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* 9:16 Video Player Container */}
            <div className="w-full md:w-80 bg-black flex items-center justify-center p-4 relative">
              <video
                src={selectedVideo.video_stream_url && selectedVideo.video_stream_url.startsWith('http') ? selectedVideo.video_stream_url : '/demo.mp4'}
                controls
                autoPlay
                className="rounded-2xl max-h-[550px] w-full object-cover shadow-2xl"
              />
            </div>

            {/* Video Details & Meta */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#231e1a]">
                  <span className="text-xs font-bold text-amber-400">
                    {selectedVideo.style} • {selectedVideo.cafe_id}
                  </span>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-lg font-extrabold text-white mt-4">
                  {selectedVideo.script_data?.hook_text || selectedVideo.user_caption}
                </h2>
                <div className="mt-3 p-3 bg-[#1c1815] rounded-xl border border-[#2a221b] text-xs text-gray-300 leading-relaxed">
                  <span className="font-bold text-amber-400 block mb-1">🎙️ النص الصوتي السعودي:</span>
                  {selectedVideo.script_data?.voiceover_text}
                </div>

                {/* Hashtags */}
                {selectedVideo.script_data?.hashtags && (
                  <div className="mt-3 text-xs text-amber-300/80 font-medium leading-relaxed">
                    {selectedVideo.script_data.hashtags.join(' ')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#231e1a] flex items-center justify-between gap-3">
                <a
                  href={selectedVideo.video_stream_url || 'http://127.0.0.1:8000/media/test_final_video.mp4'}
                  download={`saudi_cafe_${selectedVideo.id}.mp4`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  تحميل MP4 (9:16)
                </a>
                <button
                  onClick={() => {
                    handleRegenerate(selectedVideo.id);
                    setSelectedVideo(null);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-[#201a16] border border-[#2e2620] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  إعادة التوليد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
