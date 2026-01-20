'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadDropzone from '@/components/UploadDropzone';
import Toast from '@/components/ui/toast';
import { uploadInvoice } from '@/lib/api';

const UploadPage = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const handleUpload = async (file: File) => {
    setLoading(true);
    setToast(null);
    try {
      const response = await uploadInvoice(file);
      if (response?.invoice_id) {
        setToast({ message: 'Upload successful!', type: 'success' });
        setTimeout(() => {
          router.push(`/invoice/${response.invoice_id}`);
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setToast({ message: 'Upload failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Upload Invoice</h1>
        <p className="text-slate-500 mt-1">Upload PDF or image files to extract invoice data</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <UploadDropzone onUpload={handleUpload} loading={loading} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default UploadPage;