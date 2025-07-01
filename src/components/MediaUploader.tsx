import React, { useRef } from 'react';
import { Camera, Upload, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploaderProps {
  onMediaUpload: (url: string, type: 'image' | 'video') => void;
  currentMedia?: string;
  mediaType?: 'image' | 'video';
  bucket: 'avatars' | 'posts' | 'videos';
  userId: string;
  className?: string;
  children?: React.ReactNode;
  allowVideo?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onMediaUpload,
  currentMedia,
  mediaType,
  bucket,
  userId,
  className = '',
  children,
  allowVideo = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();

  const uploadVideo = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading video:', error);
      return { url: null, error: error as Error };
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast({
        title: "نوع ملف غير مدعوم",
        description: "يرجى اختيار صورة أو فيديو",
        variant: "destructive"
      });
      return;
    }

    if (isVideo && !allowVideo) {
      toast({
        title: "الفيديو غير مدعوم",
        description: "هذا المكون لا يدعم رفع الفيديوهات",
        variant: "destructive"
      });
      return;
    }

    // Validate file size
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image
    if (file.size > maxSize) {
      const sizeText = isVideo ? '50 ميجابايت' : '5 ميجابايت';
      toast({
        title: "حجم الملف كبير",
        description: `يرجى اختيار ملف أصغر من ${sizeText}`,
        variant: "destructive"
      });
      return;
    }

    let result;
    if (isImage) {
      result = await uploadImage(file, bucket === 'videos' ? 'posts' : bucket, userId);
    } else {
      result = await uploadVideo(file);
    }

    if (result.url) {
      onMediaUpload(result.url, isVideo ? 'video' : 'image');
    } else if (result.error) {
      toast({
        title: "خطأ في الرفع",
        description: "حدث خطأ أثناء رفع الملف",
        variant: "destructive"
      });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const acceptTypes = allowVideo ? "image/*,video/*" : "image/*";

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {children ? (
        <div onClick={triggerFileSelect} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={triggerFileSelect}
            disabled={uploading}
            variant="outline"
            className="flex-1"
          >
            {uploading ? (
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الرفع...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Upload className="w-4 h-4" />
                <span>رفع {allowVideo ? 'وسائط' : 'صورة'}</span>
              </div>
            )}
          </Button>
          
          {allowVideo && (
            <Button
              onClick={() => {
                fileInputRef.current?.setAttribute('accept', 'video/*');
                triggerFileSelect();
              }}
              disabled={uploading}
              variant="outline"
              className="px-3"
            >
              <Video className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};