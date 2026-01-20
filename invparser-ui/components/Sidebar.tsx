'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, FileText } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-blue-600">InvoiceParser</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* CORE Section */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">CORE</h2>
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/upload"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive('/upload')
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Upload className="h-5 w-5 flex-shrink-0" />
                <span>Upload Invoice</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* MANAGEMENT Section */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">MANAGEMENT</h2>
          <ul className="space-y-1">
            <li>
              <Link
                href="/invoices"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive('/invoices')
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span>Invoices</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
