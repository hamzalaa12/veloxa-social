
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage buckets if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'posts') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('posts', 'posts', true);
    END IF;
END $$;

-- Drop existing storage policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view posts" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own posts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own posts" ON storage.objects;

-- Create storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for posts bucket
CREATE POLICY "Anyone can view posts" ON storage.objects
FOR SELECT USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload posts" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own posts" ON storage.objects
FOR UPDATE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own posts" ON storage.objects
FOR DELETE USING (bucket_id = 'posts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Update profiles table to include verification fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_code_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'follow', 'message'
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notifications and other tables
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications for others" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.likes;
DROP POLICY IF EXISTS "Users can unlike their own likes" ON public.likes;
DROP POLICY IF EXISTS "Anyone can view follows" ON public.follows;
DROP POLICY IF EXISTS "Authenticated users can follow others" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their received messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications for others" 
ON public.notifications FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Anyone can view profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view posts" 
ON public.posts FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create posts" 
ON public.posts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts FOR DELETE 
USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" 
ON public.likes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can like posts" 
ON public.likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes" 
ON public.likes FOR DELETE 
USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can view follows" 
ON public.follows FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can follow others" 
ON public.follows FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
ON public.follows FOR DELETE 
USING (auth.uid() = follower_id);

-- Messages policies
CREATE POLICY "Users can view their messages" 
ON public.messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Authenticated users can send messages" 
ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" 
ON public.messages FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);

-- Create notification trigger functions
CREATE OR REPLACE FUNCTION update_notification_on_like()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Create notification for post owner (if not liking own post)
    IF NEW.user_id != (SELECT user_id FROM public.posts WHERE id = NEW.post_id) THEN
      INSERT INTO public.notifications (user_id, from_user_id, type, post_id)
      SELECT p.user_id, NEW.user_id, 'like', NEW.post_id
      FROM public.posts p WHERE p.id = NEW.post_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_notification_on_follow()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Create notification for followed user
    INSERT INTO public.notifications (user_id, from_user_id, type)
    VALUES (NEW.following_id, NEW.follower_id, 'follow');
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_notification_on_comment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Create notification for post owner (if not commenting on own post)
    IF NEW.user_id != (SELECT user_id FROM public.posts WHERE id = NEW.post_id) THEN
      INSERT INTO public.notifications (user_id, from_user_id, type, post_id, message)
      SELECT p.user_id, NEW.user_id, 'comment', NEW.post_id, NEW.content
      FROM public.posts p WHERE p.id = NEW.post_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_like_notification ON public.likes;
CREATE TRIGGER trigger_like_notification
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION update_notification_on_like();

DROP TRIGGER IF EXISTS trigger_follow_notification ON public.follows;
CREATE TRIGGER trigger_follow_notification
  AFTER INSERT ON public.follows
  FOR EACH ROW EXECUTE FUNCTION update_notification_on_follow();

DROP TRIGGER IF EXISTS trigger_comment_notification ON public.comments;
CREATE TRIGGER trigger_comment_notification
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_notification_on_comment();

-- Enable realtime for notifications
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already added to publication
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already added to publication
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already added to publication
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.likes;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already added to publication
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.follows;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already added to publication
            NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
    EXCEPTION
        WHEN duplicate_object THEN
            -- Table already added to publication
            NULL;
    END;
END $$;
