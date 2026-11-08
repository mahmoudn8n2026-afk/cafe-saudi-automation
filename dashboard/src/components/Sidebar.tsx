'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Video, 
  Coffee, 
  Settings, 
  ShieldCheck, 
  User, 
  Menu, 
  X,
  Sparkles,
  Zap,
  Activity,
  Send,
  ExternalLink,
  Bot
} from 'lucide-react';

interface SidebarProps {
  currentRole: 'admin' | 'client';
  onRoleChange: (role: 'admin' | 'client') => void;
}

export default function Sidebar({ currentRole, onRoleChange }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'الرئيسية والاستوديو', icon: LayoutDashboard },
    { href: '/jobs', label: 'سجل الفيديوهات والمحتوى', icon: Video },
    { href: '/cafes', label: 'إدارة الكافيهات والبراند', icon: Coffee },
    { href: '/settings', label: 'محركات الذكاء والمفاتيح', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-[#14110E] border-b border-white/[0.08] text-white sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C28751] to-[#8C582B] flex items-center justify-center text-white shadow-md shadow-[#C28751]/20">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block">ستوديو كافيهات السعودية</span>
            <span className="text-[10px] text-[#C28751] font-medium">أتمتة الفيديوهات السحابية 🇸🇦</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-[#120F0D] border-l border-white/[0.08] flex flex-col justify-between
        transition-transform duration-300 lg:static lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Upper Portion */}
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C28751] via-[#A8703E] to-[#7B4C26] flex items-center justify-center text-white shadow-xl shadow-[#C28751]/25">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-base text-white tracking-wide">كافيه ستوديو</h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C28751]/20 text-[#DDA15E] border border-[#C28751]/30">
                    2.0
                  </span>
                </div>
                <p className="text-[11px] text-[#A89F91] font-medium flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3 text-[#C28751]" /> محرك الأتمتة الذكي
                </p>
              </div>
            </div>

            {/* Connected Cafe Quick Pill */}
            <div className="mt-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-stone-200">سَكَف - الرياض حي السلام</span>
              </div>
              <span className="text-[10px] text-[#C28751] bg-[#C28751]/10 px-2 py-0.5 rounded-md font-bold">
                نشط
              </span>
            </div>
          </div>

          {/* Role Segmented Controller */}
          <div className="px-5 py-4">
            <div className="bg-[#181411] p-1 rounded-xl border border-white/[0.08] flex items-center justify-between text-xs font-medium">
              <button
                onClick={() => onRoleChange('admin')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs ${
                  currentRole === 'admin' 
                    ? 'bg-[#C28751] text-white font-bold shadow-md shadow-[#C28751]/20' 
                    : 'text-[#A89F91] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                أدمن المنظومة
              </button>
              <button
                onClick={() => onRoleChange('client')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs ${
                  currentRole === 'client' 
                    ? 'bg-[#C28751] text-white font-bold shadow-md shadow-[#C28751]/20' 
                    : 'text-[#A89F91] hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                صاحب الكافيه
              </button>
            </div>
            <div className="mt-2 text-[10px] text-[#8E8375] text-center">
              {currentRole === 'admin' ? 'تحكم كامل بالمحركات وسير عمل n8n' : 'معاينة الفيديوهات والموافقة على النشر'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-2 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#C28751]/20 to-[#C28751]/5 text-[#E8A858] border border-[#C28751]/30 shadow-sm' 
                      : 'text-[#A89F91] hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E8A858]' : 'text-[#8E8375]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Portion */}
        <div className="p-4 border-t border-white/[0.08] space-y-3">
          
          {/* n8n Status Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1A1613] to-[#14110E] border border-[#C28751]/20">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Bot className="w-3.5 h-3.5 text-[#C28751]" /> بوت تليجرام n8n
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> متصل
              </span>
            </div>
            <p className="text-[11px] text-[#A89F91] leading-relaxed">
              يستقبل صور المشروبات وينتج الفيديو ويرسله للموافقة تلقائياً
            </p>
          </div>

          {/* Free Tier Active Box */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-[11px] text-[#A89F91]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#E8A858]" /> الخطة المجانية نشطة
            </span>
            <span className="font-bold text-emerald-400">$0.00 / شهر</span>
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
}
