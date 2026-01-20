'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceTable from '@/components/InvoiceTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { fetchInvoices } from '@/lib/api';
import { Invoice } from '@/lib/types';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const router = useRouter();

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

  // Apply filters
  useEffect(() => {
    let filtered = invoices;

    if (vendorFilter) {
      filtered = filtered.filter(inv =>
        inv.vendor.toLowerCase().includes(vendorFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Sort
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount':
          return (b.amount || b.total || 0) - (a.amount || a.total || 0);
        case 'vendor':
          return a.vendor.localeCompare(b.vendor);
        default:
          return 0;
      }
    });

    setFilteredInvoices(filtered);
  }, [invoices, vendorFilter, statusFilter, sortBy]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Invoices</h1>
        <p className="text-slate-500 mt-1">Manage and review all your invoices</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by vendor..."
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          />
          <Select
            label="Status"
            options={[
              { value: 'All', label: 'All Status' },
              { value: 'Extracted', label: 'Extracted' },
              { value: 'Pending Review', label: 'Pending Review' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            label="Sort By"
            options={[
              { value: 'date', label: 'Date (Newest)' },
              { value: 'amount', label: 'Amount' },
              { value: 'vendor', label: 'Vendor' },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {filteredInvoices.length > 0 ? (
          <InvoiceTable
            invoices={filteredInvoices}
            onRowClick={(id) => router.push(`/invoice/${id}`)}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-2">No invoices found</p>
            <button
              onClick={() => router.push('/upload')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Upload your first invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;