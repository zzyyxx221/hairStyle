import React, { useRef } from 'react';
import { UploadIcon, TrashIcon } from './Icons';

interface ImageUploadProps {
  label: string;
  image: string | null;
  onImageChange: (image: string | null) => void;
  description?: string;
  active?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  image, 
  onImageChange, 
  description,
  active = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  if (!active) return null;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div 
        className={`relative w-full h-64 border-2 border-dashed rounded-xl transition-all duration-300 ${
          image 
            ? 'border-violet-500 bg-slate-800' 
            : 'border-slate-600 hover:border-violet-400 bg-slate-800/50 hover:bg-slate-800'
        } flex flex-col items-center justify-center overflow-hidden group cursor-pointer`}
        onClick={!image ? triggerUpload : undefined}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {image ? (
          <>
            <img 
              src={image} 
              alt="Uploaded" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); triggerUpload(); }}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
                title="Replace Image"
              >
                <UploadIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
                className="p-2 bg-red-500/80 rounded-full hover:bg-red-500 backdrop-blur-sm text-white transition-colors"
                title="Remove Image"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-700 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadIcon className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-slate-300 font-medium">Click to upload image</p>
            {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
