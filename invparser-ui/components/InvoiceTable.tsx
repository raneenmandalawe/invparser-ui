import React from 'react';
import { Invoice } from '@/lib/types';

interface InvoiceTableProps {
  invoices: Invoice[];
  onRowClick: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left py-3 px-4 font-semibold text-slate-600">Invoice</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600">Vendor</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
            <th className="text-right py-3 px-4 font-semibold text-slate-600">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
              onClick={() => onRowClick(invoice.id)}
            >
              <td className="py-3 px-4 text-sm font-medium text-slate-900">{invoice.id}</td>
              <td className="py-3 px-4 text-sm text-slate-700">{invoice.vendor}</td>
              <td className="py-3 px-4 text-sm text-slate-700">{invoice.date}</td>
              <td className="py-3 px-4 text-sm text-right font-medium text-slate-900">
                ${(invoice.amount || invoice.total || 0).toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  invoice.status === 'Extracted' 
                    ? 'bg-green-100 text-green-700'
                    : invoice.status === 'Pending Review'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {invoice.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;