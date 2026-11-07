'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  KeyRound, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  Sliders,
  Layers,
  HelpCircle
} from 'lucide-react';
import { fetchSettings, saveSettings } from '@/lib/api';
import { SystemSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    script_engine: 'free',
    video_engine: 'free',
    voice_engine: 'free',
    voice_gender: 'male',
    default_style: 'مرِح',
    auto_publish: false,
    warning_threshold: 80
  });

  const [apiKeys, setApiKeys] = useState({
    gemini_key: 'AIzaSy*******************************',
    elevenlabs_key: 'sk_eleven_**************************',
    telegram_bot_token: '7123456789:AAH*********************',
    supabase_url: 'https://xyzcompany.supabase.co',
    supabase_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  });

  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const handleToggle = (key: keyof SystemSettings) => {
    setSettings((prev) => {
      const current = prev[key];
      if (typeof current === 'boolean') {
        return { ...prev, [key]: !current };
      }
      if (current === 'free') {
        return { ...prev, [key]: 'paid' };
      }
      return { ...prev, [key]: 'free' };
    });
  };

  const handleSave = async () => {
    await saveSettings(settings);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#231e1a]">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            إعدادات المنظومة والتبديل بين المجاني والمدفوع
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            تحكم في مصادر الذكاء الاصطناعي لكل خطوة بدون تعديل سطر كود واحد.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow hover:brightness-110 transition"
        >
          {savedToast ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
          {savedToast ? 'تم الحفظ بنجاح!' : 'حفظ الإعدادات'}
        </button>
      </div>

      {/* Free vs Paid Toggle Engine Cards */}
      <div className="bg-[#14110e] border border-[#231e1a] rounded-3xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            مفاتيح التبديل (Free vs Paid Engine Switcher)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            إذا تم تفعيل الخيار المدفوع ونفد رصيده، سينتقل النظام تلقائيًا للمحرك المجاني كـ Fallback بدون توقف.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Script */}
          <div className="bg-[#1b1714] border border-[#2e2620] rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-200">1. كتابة السكريبت</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  settings.script_engine === 'free' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {settings.script_engine === 'free' ? 'مجاني (Gemini Flash)' : 'مدفوع (GPT-4o)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {settings.script_engine === 'free' 
                  ? 'Gemini 1.5 Flash (1500 طلب مجاني يوميًا - تكلفة 0$)' 
                  : 'OpenAI GPT-4o (أعلى جودة إعلانية - بتكلفة)'}
              </p>
            </div>
            <button
              onClick={() => handleToggle('script_engine')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#251e19] hover:bg-[#2e2620] text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {settings.script_engine === 'free' ? <ToggleLeft className="w-5 h-5 text-emerald-400" /> : <ToggleRight className="w-5 h-5 text-purple-400" />}
              التبديل إلى {settings.script_engine === 'free' ? 'المدفوع' : 'المجاني'}
            </button>
          </div>

          {/* Step 2: Voice */}
          <div className="bg-[#1b1714] border border-[#2e2620] rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-200">2. الصوت والتعليق (TTS)</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  settings.voice_engine === 'free' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {settings.voice_engine === 'free' ? 'مجاني (Edge-TTS)' : 'مدفوع (ElevenLabs)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {settings.voice_engine === 'free' 
                  ? 'Edge-TTS السعودي: حامد وزارية (مجاني 100% غير محدود)' 
                  : 'ElevenLabs Voice Clone (10,000 حرف مجاني شهريًا)'}
              </p>
            </div>
            <button
              onClick={() => handleToggle('voice_engine')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#251e19] hover:bg-[#2e2620] text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {settings.voice_engine === 'free' ? <ToggleLeft className="w-5 h-5 text-emerald-400" /> : <ToggleRight className="w-5 h-5 text-purple-400" />}
              التبديل إلى {settings.voice_engine === 'free' ? 'ElevenLabs' : 'Edge-TTS المجاني'}
            </button>
          </div>

          {/* Step 3: Video */}
          <div className="bg-[#1b1714] border border-[#2e2620] rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-200">3. تحريك الفيديو (Motion)</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  settings.video_engine === 'free' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {settings.video_engine === 'free' ? 'مجاني (FFmpeg)' : 'مدفوع (Kling AI)'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {settings.video_engine === 'free' 
                  ? 'FFmpeg Ken Burns 9:16 (سريع جدًا، مجاني غير محدود)' 
                  : 'Kling / Luma AI Video (توليد فيديو بالذكاء الاصطناعي)'}
              </p>
            </div>
            <button
              onClick={() => handleToggle('video_engine')}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-[#251e19] hover:bg-[#2e2620] text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {settings.video_engine === 'free' ? <ToggleLeft className="w-5 h-5 text-emerald-400" /> : <ToggleRight className="w-5 h-5 text-purple-400" />}
              التبديل إلى {settings.video_engine === 'free' ? 'Kling AI' : 'FFmpeg المجاني'}
            </button>
          </div>
        </div>
      </div>

      {/* API Keys Configuration */}
      <div className="bg-[#14110e] border border-[#231e1a] rounded-3xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            إدارة مفاتيح الـ API (تُحفظ مشفرة في الخادم ولا تُكتب في الكود)
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            جميع الأدوات الأساسية تعمل حاليًا بالمحرك المجاني بدون الحاجة لإدخال أي مفتاح إجباري.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Gemini API Key (مجاني):</label>
            <input
              type="password"
              value={apiKeys.gemini_key}
              onChange={(e) => setApiKeys({ ...apiKeys, gemini_key: e.target.value })}
              className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-300 font-mono"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Telegram Bot Token (مجاني):</label>
            <input
              type="password"
              value={apiKeys.telegram_bot_token}
              onChange={(e) => setApiKeys({ ...apiKeys, telegram_bot_token: e.target.value })}
              className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-300 font-mono"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">ElevenLabs API Key (احتياطي مدفوع):</label>
            <input
              type="password"
              value={apiKeys.elevenlabs_key}
              onChange={(e) => setApiKeys({ ...apiKeys, elevenlabs_key: e.target.value })}
              className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-300 font-mono"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Supabase Service Role Key:</label>
            <input
              type="password"
              value={apiKeys.supabase_key}
              onChange={(e) => setApiKeys({ ...apiKeys, supabase_key: e.target.value })}
              className="w-full p-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-300 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Alert Threshold Slider */}
      <div className="bg-[#14110e] border border-[#231e1a] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              نسبة التحذير المبكر للاستهلاك
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              إرسال إشعار تليجرام وتنبيه باللوحة عندما يصل استهلاك أي أداة مجانية لهذه النسبة.
            </p>
          </div>
          <span className="text-lg font-extrabold text-amber-400">
            {settings.warning_threshold}%
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="95"
          step="5"
          value={settings.warning_threshold}
          onChange={(e) => setSettings({ ...settings, warning_threshold: parseInt(e.target.value) })}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>50% (تحذير مبكر جدًا)</span>
          <span>80% (موصى به)</span>
          <span>95% (تحذير حرج)</span>
        </div>
      </div>
    </div>
  );
}
