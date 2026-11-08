'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Check, 
  Coffee, 
  Mic2, 
  Film, 
  Sliders, 
  Zap,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';
import { Job } from '@/lib/types';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  if (!isOpen) return null;

  const [caption, setCaption] = useState('آيس دريب + سبانش لاتيه + تشيز كيك سن سباستيان');
  const [selectedStyle, setSelectedStyle] = useState<'مرِح' | 'أستيتيك' | 'تريند'>('مرِح');
  const [selectedVoice, setSelectedVoice] = useState<'hamed' | 'zariyah'>('hamed');
  const [engineMode, setEngineMode] = useState<'free' | 'paid'>('free');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    '/images/iced_v60.jpg',
    '/images/spanish_latte.jpg',
    '/images/cheesecake.jpg'
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const availablePhotos = [
    { id: '1', path: '/images/iced_v60.jpg', label: 'آيس دريب V60' },
    { id: '2', path: '/images/spanish_latte.jpg', label: 'سبانش لاتيه' },
    { id: '3', path: '/images/cheesecake.jpg', label: 'تشيز كيك باسك' },
  ];

  const togglePhoto = (path: string) => {
    if (selectedPhotos.includes(path)) {
      if (selectedPhotos.length > 1) {
        setSelectedPhotos(selectedPhotos.filter(p => p !== path));
      }
    } else {
      setSelectedPhotos([...selectedPhotos, path]);
    }
  };

  const handleStartProduction = () => {
    setIsProcessing(true);
    setCurrentStep(1);

    // Simulate stepping through the workflow
    setTimeout(() => setCurrentStep(2), 1200);
    setTimeout(() => setCurrentStep(3), 2600);
    setTimeout(() => setCurrentStep(4), 4200);

    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(0);

      const generatedJob: Job = {
        id: `job-sakaf-${Date.now().toString().slice(-4)}`,
        cafe_id: 'cafe-riyadh-01',
        telegram_chat_id: '9665000000',
        original_images: selectedPhotos,
        user_caption: caption,
        style: selectedStyle,
        status: 'ready',
        script_data: {
          hook_text: selectedStyle === 'مرِح' 
            ? 'يا هلا والله بالروقان! هبّة اليوم لا تفوتك 🔥'
            : selectedStyle === 'أستيتيك' 
              ? 'هدوء ورائحة بن فاخرة في حي السلام ✨'
              : 'تحدي عشاق القهوة المختصة اليوم! 🏆',
          voiceover_text: 'يا هلا والله بالروقان! إذا ودك تروق على أصولها.. اليوم هبتنا غير! آيس دريب يسرسح، وسبانش مثلج يضبط المزاج، ومعاهم سن سباستيان فاخرة تذوب بالفم! مرنا وعيش الجو، وخويك اليوم يعزمك!',
          estimated_duration: 19.5,
          style: selectedStyle === 'مرِح' ? 'cheerful' : selectedStyle === 'أستيتيك' ? 'aesthetic' : 'trend',
          style_arabic: selectedStyle,
          subtitles: [
            { text: 'يا هلا والله بالروقان! هبّة اليوم لا تفوتك', start: 0, end: 4.5 },
            { text: 'آيس دريب وسبانش مثلج يسرسح على قلبك', start: 4.5, end: 9.3 },
            { text: 'ومعاهم سن سباستيان فاخرة تذوب بالفم', start: 9.3, end: 14.1 },
            { text: 'مرنا وعيش الجو وخويك اليوم يعزمك', start: 14.1, end: 19.5 }
          ],
          captions: {
            tiktok: `${caption} يسرسح على القلب! جربت هبة سكف اليوم؟ منشن اللي يعزمك! #كافيهات_الرياض #قهوة_مختصة #حي_السلام #هبة_جديدة`,
            reels: `على جوك وفي وقتك! 😍✨ ${caption} في حي السلام بالرياض. احفظ البوست لطلعة الويكند! #riyadh_cafes #specialty_coffee`,
            snapchat: `اليوم هبتنا غير في حي السلام! 🔥 ${caption} .. مرنا الحين!`,
            facebook: `روّق مزاجك مع باقة الصيف الخاصة في كافيه سَكَف بالرياض! ${caption} في أجواء هادئة بدون صخب.`
          },
          hashtags: ['#كافيهات_الرياض', '#قهوة_مختصة', '#حي_السلام', '#هبة_جديدة', '#يسرسح', '#ترند_السعودية']
        },
        video_url: '/saudi_cafe_masterpiece.mp4',
        video_stream_url: '/saudi_cafe_masterpiece.mp4',
        retry_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onJobCreated(generatedJob);
      onClose();
    }, 5500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#16120E] text-[#F5F2ED] rounded-3xl border border-[#C28751]/30 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 end-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all disabled:opacity-40"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C28751] to-[#8C582B] flex items-center justify-center text-white shadow-lg shadow-[#C28751]/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              محاكي إنتاج فيديو جديد (سير عمل n8n)
            </h3>
            <p className="text-xs text-[#A89F91]">
              اختبر دورة إنتاج الفيديو المكتملة كأنها استُلمت عبر بوت تليجرام
            </p>
          </div>
        </div>

        {isProcessing ? (
          /* Processing State Animation */
          <div className="py-10 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-[#C28751]/20 border-t-[#C28751] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-[#E8A858]">
                <Film className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white">
                {currentStep === 1 && '1/4 جاري كتابة السكريبت الشبابي بواسطة Gemini Flash...'}
                {currentStep === 2 && '2/4 تحريك الكاميرا والزوم (Ken Burns 9:16) عبر FFmpeg...'}
                {currentStep === 3 && '3/4 توليد التعليق الصوتي السعودي النقي (Hamed Edge-TTS)...'}
                {currentStep === 4 && '4/4 رندرة الفيديو النهائي ودمج الترجمة والموسيقى...'}
              </h4>
              <p className="text-xs text-[#A89F91]">
                نظام المعالجة السريع يجمع المقاطع بدقة 1080x1920 وبدون أي تكلفة
              </p>
            </div>

            {/* Stepper Progress Bar */}
            <div className="max-w-md mx-auto grid grid-cols-4 gap-2 pt-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-2 rounded-full transition-all ${
                    currentStep >= stepNum ? 'bg-[#C28751]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Input Form */
          <div className="space-y-5">
            
            {/* Step 1: Photos Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-2">
                1. صور المشروب والحلا (اختر من صور كافيه سَكَف الموثقة):
              </label>
              <div className="grid grid-cols-3 gap-3">
                {availablePhotos.map((photo) => {
                  const isSelected = selectedPhotos.includes(photo.path);
                  return (
                    <div
                      key={photo.id}
                      onClick={() => togglePhoto(photo.path)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all h-28 group ${
                        isSelected
                          ? 'border-[#C28751] shadow-lg shadow-[#C28751]/20 scale-[1.02]'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.path}
                        alt={photo.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-[#C28751] text-white' : 'bg-black/50 text-white'
                          }`}>
                            {isSelected ? <Check className="w-3 h-3" /> : '+'}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow">
                          {photo.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Caption Input */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                2. نص المشروب أو العرض (الكابشن القصير):
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="مثال: فلات وايت مع كيكة الكوكونت..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm outline-none focus:border-[#C28751] transition-colors"
              />
            </div>

            {/* Step 3: Style Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  3. نمط المحتوى:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'مرِح', label: 'مرِح 🎉' },
                    { id: 'أستيتيك', label: 'أستيتيك ✨' },
                    { id: 'تريند', label: 'تريند 🔥' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStyle(s.id as any)}
                      className={`py-2 px-1 rounded-xl font-bold border transition-all ${
                        selectedStyle === s.id
                          ? 'bg-[#C28751] text-white border-[#C28751]'
                          : 'bg-white/5 text-stone-400 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Voiceover Selector */}
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  4. المعلق الصوتي (لهجة سعودية):
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedVoice('hamed')}
                    className={`py-2 px-2 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      selectedVoice === 'hamed'
                        ? 'bg-[#C28751] text-white border-[#C28751]'
                        : 'bg-white/5 text-stone-400 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Mic2 className="w-3.5 h-3.5" />
                    <span>حامد (نجدي شبابي)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVoice('zariyah')}
                    className={`py-2 px-2 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      selectedVoice === 'zariyah'
                        ? 'bg-[#C28751] text-white border-[#C28751]'
                        : 'bg-white/5 text-stone-400 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Mic2 className="w-3.5 h-3.5" />
                    <span>زارية (عصرية)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cost & Policy Footnote */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-emerald-400" />
                المحرك يعمل بالخطة المجانية 100% (Gemini Flash + FFmpeg + Edge-TTS)
              </span>
              <span className="font-bold">$0.00</span>
            </div>

            {/* Action Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/15 text-white hover:bg-white/5 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleStartProduction}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C28751] hover:bg-[#A8703E] text-white text-xs font-bold shadow-lg shadow-[#C28751]/25 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4" />
                <span>بدء إنتاج الفيديو الآن ⚡</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
