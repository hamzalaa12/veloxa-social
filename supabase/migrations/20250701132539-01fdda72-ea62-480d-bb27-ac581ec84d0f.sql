-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Add video support to posts table
ALTER TABLE public.posts ADD COLUMN media_type VARCHAR(20) DEFAULT 'text';
ALTER TABLE public.posts ADD COLUMN video_url TEXT;

-- Update existing posts to have media_type
UPDATE public.posts SET media_type = CASE 
  WHEN image_url IS NOT NULL THEN 'image'
  ELSE 'text'
END;

-- Create storage policies for videos bucket
CREATE POLICY "Videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);