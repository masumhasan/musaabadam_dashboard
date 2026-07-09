import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  error?: string;
}

export function ImageUpload({ value, onChange, folder, label, error }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 1. Get presigned URL
      const { data } = await api.post('/admin/uploads/presigned-url', {
        folder,
        contentType: file.type,
        fileSize: file.size,
      });

      const { uploadUrl, publicUrl } = data.data;

      // 2. Upload file to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image to S3');
      }

      // 3. Set the form value
      onChange(publicUrl);
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-slate-700" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`h-16 w-16 rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800 hover:border-slate-500 hover:text-slate-400 transition-colors cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          </div>
        )}
        
        <div className="flex-1">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp, image/gif"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isUploading ? 'Uploading...' : (value ? 'Change image' : 'Upload image')}
          </button>
          <p className="text-xs text-slate-500 mt-1">JPEG, PNG, WEBP up to 10MB</p>
        </div>
      </div>
      
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
