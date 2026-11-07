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
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentRole: 'admin' | 'client';
  onRoleChange: (role: 'admin' | 'client') => void;
}

export default function Sidebar({ currentRole, onRoleChange }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
    { href: '/jobs', label: 'سجل الفيديوهات والمحتوى', icon: Video },
    { href: '/cafes', label: 'إدارة الكافيهات والبراند', icon: Coffee },
    { href: '/settings', label: 'إعدادات الأدوات والمفاتيح', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-[#141210] border-b border-[#2d2722] text-white">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Coffee className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-amber-100">كافيه ستوديو ☕</span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-[#221d19] text-gray-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-72 bg-[#12100e] border-l border-[#27211c] flex flex-col justify-between
        transition-transform duration-300 lg:static lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-6 border-b border-[#231e1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-wide">كافيه ستوديو</h1>
                <p className="text-xs text-amber-400/90 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> أتمتة محتوى الكافيهات
                </p>
              </div>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="px-5 py-4">
            <div className="bg-[#1b1714] p-1.5 rounded-xl border border-[#2e2620] flex items-center justify-between text-xs font-medium">
              <button
                onClick={() => onRoleChange('admin')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  currentRole === 'admin' 
                    ? 'bg-amber-500 text-black font-bold shadow' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                أدمن النظام
              </button>
              <button
                onClick={() => onRoleChange('client')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  currentRole === 'client' 
                    ? 'bg-amber-500 text-black font-bold shadow' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                صاحب الكافيه
              </button>
            </div>
            <div className="mt-2 px-1 text-[11px] text-gray-500 text-center">
              {currentRole === 'admin' ? 'صلاحية كاملة لجميع الكافيهات والمهام' : 'عرض محتوى كافيه أروما الرياض فقط'}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-2 space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold' 
                      : 'text-gray-400 hover:bg-[#1a1613] hover:text-gray-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Free Plan Status Footer */}
        <div className="p-4 border-t border-[#231e1a]">
          <div className="bg-gradient-to-br from-[#1d1814] to-[#171310] border border-amber-500/20 rounded-2xl p-4 text-xs">
            <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-amber-400" /> الخطة المجانية 100%
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                نشطة
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              محرك FFmpeg و Edge-TTS السعودي يعملان بلا تكلفة. السعة المتبقية: 99.8%
            </p>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}
    </>
  );
}
