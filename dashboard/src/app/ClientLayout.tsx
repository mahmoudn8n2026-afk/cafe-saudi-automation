'use client';

import React, { useState, createContext, useContext } from 'react';
import Sidebar from '@/components/Sidebar';

interface RoleContextType {
  role: 'admin' | 'client';
  setRole: (role: 'admin' | 'client') => void;
}

const RoleContext = createContext<RoleContextType>({
  role: 'admin',
  setRole: () => {}
});

export const useRole = () => useContext(RoleContext);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<'admin' | 'client'>('admin');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#0c0a09]">
        <Sidebar currentRole={role} onRoleChange={setRole} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </RoleContext.Provider>
  );
}
