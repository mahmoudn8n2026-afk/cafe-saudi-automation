'use client';

import React, { useState } from 'react';
import { 
  Coffee, 
  Plus, 
  MapPin, 
  Palette, 
  Volume2, 
  Sparkles, 
  Camera, 
  Share2, 
  Check,
  Building
} from 'lucide-react';
import { useRole } from '../ClientLayout';

interface CafeItem {
  id: string;
  name: string;
  city: string;
  primary_color: string;
  secondary_color: string;
  tone: string;
  voice: string;
  default_style: string;
  tiktok: string;
  instagram: string;
}

export default function CafesPage() {
  const { role } = useRole();
  const [cafes, setCafes] = useState<CafeItem[]>([
    {
      id: 'cafe-riyadh-01',
      name: 'سَكَف - قهوة مختصة (Sakaf Specialty Coffee)',
      city: 'الرياض - حي السلام (شرق الرياض)',
      primary_color: '#C28751',
      secondary_color: '#14110E',
      tone: 'لهجة سعودية شبابية رايقة وعفوية تجمع بين الهدوء والسكينة والقهوة المختصة',
      voice: 'حامد السعودي (ar-SA-HamedNeural) - نقي وطبيعي',
      default_style: 'مرِح',
      tiktok: '@sakaf.sa',
      instagram: '@sakaf.sa'
    },
    {
      id: 'cafe-riyadh-02',
      name: 'كافيه أروما الرياض (Aroma Roastery)',
      city: 'الرياض - حي النخيل',
      primary_color: '#DDA15E',
      secondary_color: '#181411',
      tone: 'لهجة سعودية شبابية رايقة وخفيفة ("يسرسح"، "على جوك")',
      voice: 'حامد السعودي (ar-SA-HamedNeural) - ودود ومرح',
      default_style: 'مرِح',
      tiktok: '@aroma.riyadh',
      instagram: '@aroma_coffee'
    },
    {
      id: 'cafe-jeddah-02',
      name: 'كافيه موج البحر (Wave Cafe)',
      city: 'جدة - طريق الكورنيش',
      primary_color: '#06B6D4',
      secondary_color: '#0F172A',
      tone: 'أستيتيك هادي ورايق مع تفاصيل القهوة المختصة',
      voice: 'زارية السعودية (ar-SA-ZariyahNeural) - هادئة وأستيتيك',
      default_style: 'أستيتيك',
      tiktok: '@wave.jeddah',
      instagram: '@wave_specialty'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCafe, setNewCafe] = useState({
    name: '',
    city: 'الرياض',
    primary_color: '#F59E0B',
    secondary_color: '#18181B',
    tone: 'لهجة سعودية شبابية خفيفة',
    voice: 'حامد السعودي (ar-SA-HamedNeural)',
    default_style: 'مرِح',
    tiktok: '',
    instagram: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCafe.name) return;
    const item: CafeItem = {
      id: `cafe-${Date.now()}`,
      ...newCafe
    };
    setCafes([...cafes, item]);
    setShowAddModal(false);
    setNewCafe({
      name: '',
      city: 'الرياض',
      primary_color: '#F59E0B',
      secondary_color: '#18181B',
      tone: 'لهجة سعودية شبابية خفيفة',
      voice: 'حامد السعودي (ar-SA-HamedNeural)',
      default_style: 'مرِح',
      tiktok: '',
      instagram: ''
    });
  };

  // Role filtering
  const displayedCafes = role === 'admin' 
    ? cafes 
    : cafes.filter(c => c.id === 'cafe-riyadh-01');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#231e1a]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-400" />
            إدارة الكافيهات والبراند ☕
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            تخصيص الهوية البصرية، نبرة الصوت السعودي، المعلق الصوتي المختار، وحسابات التواصل.
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow hover:brightness-110 transition"
          >
            <Plus className="w-4 h-4" />
            إضافة كافيه جديد
          </button>
        )}
      </div>

      {/* Cafes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedCafes.map((c) => (
          <div key={c.id} className="bg-[#14110e] border border-[#231e1a] rounded-3xl p-6 space-y-4 hover:border-amber-500/30 transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-lg"
                  style={{ backgroundColor: c.primary_color }}
                >
                  <Coffee className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{c.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {c.city}
                  </p>
                </div>
              </div>
              <span className="bg-[#1f1915] border border-[#30261f] text-amber-400 px-3 py-1 rounded-xl text-xs font-semibold">
                النمط: {c.default_style}
              </span>
            </div>

            {/* Tone & Voice Spec */}
            <div className="space-y-2 bg-[#1b1714] p-3.5 rounded-2xl border border-[#2b231d] text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">نبرة الكلام:</span> {c.tone}
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">الصوت المختار:</span> {c.voice}
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-gray-300">
                  <span className="text-amber-400">🎵</span> {c.tiktok}
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Camera className="w-3.5 h-3.5 text-pink-400" /> {c.instagram}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold">
                حساب نشط
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Cafe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14110e] border border-[#2e2620] rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">إضافة كافيه جديد للمنظومة</h2>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1 font-semibold">اسم الكافيه:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: كافيه رشفة بالرياض"
                  value={newCafe.name}
                  onChange={(e) => setNewCafe({ ...newCafe, name: e.target.value })}
                  className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">المدينة:</label>
                  <input
                    type="text"
                    value={newCafe.city}
                    onChange={(e) => setNewCafe({ ...newCafe, city: e.target.value })}
                    className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">النمط الافتراضي:</label>
                  <select
                    value={newCafe.default_style}
                    onChange={(e) => setNewCafe({ ...newCafe, default_style: e.target.value })}
                    className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="مرِح">مرِح وفرفشة (يسرسح)</option>
                    <option value="أستيتيك">أستيتيك ورايق</option>
                    <option value="ترند">ترند وتحدي وهبة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">الصوت العربي المعتمد:</label>
                <select
                  value={newCafe.voice}
                  onChange={(e) => setNewCafe({ ...newCafe, voice: e.target.value })}
                  className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="حامد السعودي (ar-SA-HamedNeural)">حامد السعودي (ar-SA-HamedNeural) - نبرة شبابية مرحة</option>
                  <option value="زارية السعودية (ar-SA-ZariyahNeural)">زارية السعودية (ar-SA-ZariyahNeural) - نبرة أنثوية رايقة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">يوزر تيك توك:</label>
                  <input
                    type="text"
                    placeholder="@cafe_tiktok"
                    value={newCafe.tiktok}
                    onChange={(e) => setNewCafe({ ...newCafe, tiktok: e.target.value })}
                    className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 font-semibold">يوزر انستقرام:</label>
                  <input
                    type="text"
                    placeholder="@cafe_instagram"
                    value={newCafe.instagram}
                    onChange={(e) => setNewCafe({ ...newCafe, instagram: e.target.value })}
                    className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#201a16] text-gray-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold shadow"
                >
                  حفظ الكافيه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
