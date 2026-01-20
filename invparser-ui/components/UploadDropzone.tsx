'use client';

import React, { useCallback, useState } from 'react';
import { Cloud, Check, AlertCircle } from 'lucide-react';

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  loading?: boolean;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onUpload, loading = false }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

        if (!validTypes.includes(file.type)) {
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
            return;
        }

        setUploadStatus('uploading');
        try {
            await onUpload(file);
            setUploadStatus('success');
            setTimeout(() => setUploadStatus('idle'), 2000);
        } catch (error) {
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition duration-300 cursor-pointer ${
                isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
            }`}
        >
            <input
                type="file"
                onChange={handleChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
            />

            <div className="flex flex-col items-center justify-center">
                {uploadStatus === 'idle' && (
                    <>
                        <Cloud className="h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            Drag & drop your invoice here
                        </h3>
                        <p className="text-slate-500 text-sm">
                            or click to select a file (PDF, PNG, JPG)
                        </p>
                    </>
                )}

                {uploadStatus === 'uploading' && (
                    <>
                        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                        <p className="text-slate-700 font-medium">Uploading your invoice...</p>
                    </>
                )}

                {uploadStatus === 'success' && (
                    <>
                        <Check className="h-12 w-12 text-green-500 mb-4" />
                        <p className="text-green-700 font-medium">Upload successful!</p>
                    </>
                )}

                {uploadStatus === 'error' && (
                    <>
                        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                        <p className="text-red-700 font-medium">Upload failed</p>
                        <p className="text-red-600 text-sm">Please try again with a valid file</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadDropzone;