'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { clearAuth } from '@/lib/auth';

const Topbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 sticky top-0 px-6 flex items-center justify-between z-40">
      <h1 className="text-base font-semibold text-slate-800">Welcome, <span className="font-bold">admin</span></h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
};

export default Topbar;
