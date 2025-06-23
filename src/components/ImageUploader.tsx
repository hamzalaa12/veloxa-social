
import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  bucket: 'avatars' | 'posts';
  userId: string;
  className?: string;
  children?: React.ReactNode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  bucket,
  userId,
  className = '',
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت');
      return;
    }

    const result = await uploadImage(file, bucket, userId);
    if (result.url) {
      onImageUpload(result.url);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {children ? (
        <div onClick={triggerFileSelect} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button
          onClick={triggerFileSelect}
          disabled={uploading}
          variant="outline"
          className="w-full"
        >
          {uploading ? (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 space-x-reverse">
              <Upload className="w-4 h-4" />
              <span>رفع صورة</span>
            </div>
          )}
        </Button>
      )}
    </div>
  );
};
