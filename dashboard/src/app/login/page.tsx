'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, ShieldCheck, User, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useRole } from '../ClientLayout';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'client'>('admin');
  const [email, setEmail] = useState('owner@aroma-cafe.sa');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-[#14110e] border border-[#27211c] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 mx-auto flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
            <Coffee className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">تسجيل الدخول</h1>
          <p className="text-xs text-gray-400">
            نظام إدارة محتوى كافيهات الشباب السعودية (Supabase Auth)
          </p>
        </div>

        {/* Role Selector Pill */}
        <div className="bg-[#1b1714] p-1.5 rounded-2xl border border-[#2e2620] flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setEmail('admin@cafestudio.sa');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              selectedRole === 'admin'
                ? 'bg-amber-500 text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            أدمن النظام
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('client');
              setEmail('owner@aroma-cafe.sa');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              selectedRole === 'client'
                ? 'bg-amber-500 text-black shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            صاحب كافيه
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">البريد الإلكتروني:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-3 py-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">كلمة المرور:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-3 py-2.5 bg-[#1b1714] border border-[#2c241e] rounded-xl text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>الدخول إلى لوحة التحكم ({selectedRole === 'admin' ? 'أدمن' : 'عميل'})</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          الصلاحيات: حساب الأدمن يشرف على جميع الكافيهات، وحساب العميل يشاهد ويدير كافيه أروما فقط.
        </p>
      </div>
    </div>
  );
}
