import React from 'react';
import Link from 'next/link';
import { Upload, FileText, Star, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🚀</span>
                <h3 className="text-xl font-semibold text-slate-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Link href="/upload">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-2 transition-colors duration-200">
                        <Upload className="h-5 w-5" />
                        Upload Invoice
                    </button>
                </Link>
                <Link href="/invoices">
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-2 transition-colors duration-200">
                        <FileText className="h-5 w-5" />
                        View All
                    </button>
                </Link>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-2 transition-colors duration-200 opacity-60 cursor-not-allowed" disabled>
                    <Star className="h-5 w-5" />
                    Favorites
                </button>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg py-3 px-4 font-medium flex items-center justify-center gap-2 transition-colors duration-200 opacity-60 cursor-not-allowed" disabled>
                    <Settings className="h-5 w-5" />
                    Settings
                </button>
            </div>
        </div>
    );
};

export default QuickActions;