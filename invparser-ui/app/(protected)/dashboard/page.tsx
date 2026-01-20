'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Calendar, AlertCircle, DollarSign } from 'lucide-react';
import StatCard from '@/components/StatCard';
import QuickActions from '@/components/QuickActions';
import InvoiceTable from '@/components/InvoiceTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { fetchInvoices } from '@/lib/api';
import { Invoice } from '@/lib/types';

const DashboardPage = () => {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const data = await fetchInvoices();
                setInvoices(data);
            } catch (err) {
                setError('Failed to load invoices');
            } finally {
                setLoading(false);
            }
        };

        loadInvoices();
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    const totalInvoices = invoices.length;
    const thisMonth = invoices.filter(inv => {
        const invoiceDate = new Date(inv.date);
        const now = new Date();
        return invoiceDate.getMonth() === now.getMonth() && invoiceDate.getFullYear() === now.getFullYear();
    }).length;
    const pendingReview = invoices.filter(invoice => invoice.status === 'Pending Review').length;
    const averageValue = invoices.length > 0 
        ? invoices.reduce((acc, invoice) => acc + (invoice.amount || invoice.total || 0), 0) / totalInvoices 
        : 0;

    // Find top vendor
    const vendorCounts: { [key: string]: number } = {};
    invoices.forEach(inv => {
        vendorCounts[inv.vendor] = (vendorCounts[inv.vendor] || 0) + 1;
    });
    const topVendor = Object.entries(vendorCounts).sort((a, b) => b[1] - a[1])[0];

    // Recent invoices (limit to 5)
    const recentInvoices = invoices.slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome to your invoice management system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Invoices" 
                    value={totalInvoices}
                    subtitle="All extracted invoices"
                    icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                />
                <StatCard 
                    title="This Month" 
                    value={thisMonth}
                    subtitle="Invoices in January"
                    icon={<Calendar className="h-5 w-5 text-purple-500" />}
                />
                <StatCard 
                    title="Pending Review" 
                    value={pendingReview}
                    subtitle="Low confidence extractions"
                    icon={<AlertCircle className="h-5 w-5 text-orange-500" />}
                />
                <StatCard 
                    title="Average Value" 
                    value={`$${averageValue.toFixed(0)}`}
                    subtitle="Mean invoice amount"
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                />
            </div>

            {/* Quick Actions & Top Vendor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <QuickActions />
                </div>
                
                {/* Top Vendor Card */}
                {topVendor && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🏆</span>
                            <h3 className="font-semibold text-slate-900">Top Vendor</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">Most frequent vendor</p>
                        <h4 className="text-2xl font-semibold text-slate-900">{topVendor[0]}</h4>
                        <p className="text-slate-500 text-sm mt-2">{topVendor[1]} invoices</p>
                    </div>
                )}
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📋</span>
                        <h3 className="text-xl font-semibold text-slate-900">Recent Invoices</h3>
                    </div>
                    <button
                        onClick={() => router.push('/invoices')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        View All →
                    </button>
                </div>
                {recentInvoices.length > 0 ? (
                    <InvoiceTable 
                        invoices={recentInvoices} 
                        onRowClick={(id) => router.push(`/invoice/${id}`)}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-slate-500">No invoices yet. Upload one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;