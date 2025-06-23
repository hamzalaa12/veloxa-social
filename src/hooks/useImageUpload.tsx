
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, bucket: 'avatars' | 'posts', userId: string) => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ في رفع الصورة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      return { url: null, error };
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
