'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { getInvoice } from '@/lib/api';
import { Invoice } from '@/lib/types';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Button from '@/components/ui/button';

const InvoiceDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchInvoice = async () => {
                try {
                    const data = await getInvoice(id);
                    setInvoice(data);
                } catch (err) {
                    setError('Failed to load invoice details.');
                } finally {
                    setLoading(false);
                }
            };

            fetchInvoice();
        }
    }, [id]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to invoices
                </button>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to invoices
                </button>
                <div className="text-slate-500">No invoice found.</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to invoices
            </button>

            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Invoice {invoice.invoice_number || invoice.id}</h1>
                <p className="text-slate-500 mt-1">View and edit extracted invoice details</p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Extracted Fields */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Vendor Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">Vendor</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
                                <input
                                    type="text"
                                    defaultValue={invoice.vendor || ''}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dates Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">Dates</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Date</label>
                                <input
                                    type="text"
                                    defaultValue={invoice.date || ''}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                <input
                                    type="text"
                                    defaultValue={invoice.due_date || ''}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4">Totals</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount</label>
                                <input
                                    type="text"
                                    defaultValue={`$${(invoice.total || invoice.amount || 0).toFixed(2)}`}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <input
                                    type="text"
                                    defaultValue={invoice.status || ''}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Line Items Section */}
                    {invoice.items && invoice.items.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">Line Items</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-200">
                                        <tr>
                                            <th className="text-left py-2 px-2 font-medium text-slate-600">Description</th>
                                            <th className="text-right py-2 px-2 font-medium text-slate-600">Qty</th>
                                            <th className="text-right py-2 px-2 font-medium text-slate-600">Price</th>
                                            <th className="text-right py-2 px-2 font-medium text-slate-600">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, idx) => (
                                            <tr key={idx} className="border-b border-slate-100">
                                                <td className="py-2 px-2">{item.description}</td>
                                                <td className="text-right py-2 px-2">{item.quantity}</td>
                                                <td className="text-right py-2 px-2">${item.unit_price.toFixed(2)}</td>
                                                <td className="text-right py-2 px-2">${item.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex gap-3">
                        <Button className="flex-1">Save Changes</Button>
                        <Button variant="secondary" className="flex-1">Discard</Button>
                    </div>
                </div>

                {/* Right: Invoice Preview */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Invoice Preview</h2>
                    {invoice.file_url ? (
                        <div>
                            <div className="bg-slate-100 rounded-lg p-8 text-center mb-4 min-h-64">
                                <p className="text-slate-500">PDF Preview</p>
                            </div>
                            <a
                                href={invoice.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition duration-200"
                            >
                                <Download className="h-4 w-4" />
                                Download Invoice
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500">No file available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailPage;