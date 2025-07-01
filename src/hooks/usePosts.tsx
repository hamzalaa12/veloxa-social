
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  media_type: 'text' | 'image' | 'video';
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  user_liked?: boolean;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Check which posts the current user has liked
      if (user && data) {
        const postIds = data.map(post => post.id);
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedPostIds = new Set(likes?.map(like => like.post_id));
        
        const postsWithLikes = data.map(post => ({
          ...post,
          media_type: (post.media_type || 'text') as 'text' | 'image' | 'video',
          user_liked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikes as Post[]);
      } else {
        const formattedData = (data || []).map(post => ({
          ...post,
          media_type: (post.media_type || 'text') as 'text' | 'image' | 'video'
        }));
        setPosts(formattedData as Post[]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "خطأ في جلب المنشورات",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, mediaUrl?: string, mediaType: 'text' | 'image' | 'video' = 'text') => {
    if (!user) return;

    try {
      const postData: any = {
        content,
        user_id: user.id,
        media_type: mediaType
      };

      if (mediaType === 'image') {
        postData.image_url = mediaUrl;
      } else if (mediaType === 'video') {
        postData.video_url = mediaUrl;
      }

      const { error } = await supabase
        .from('posts')
        .insert(postData);

      if (error) throw error;

      fetchPosts(); // Refresh posts
      toast({
        title: "تم نشر المنشور بنجاح!",
        description: `تم إضافة ${mediaType === 'video' ? 'الفيديو' : mediaType === 'image' ? 'الصورة' : 'المنشور'} الجديد`
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "خطأ في نشر المنشور",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_liked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            post_id: postId
          });
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              user_liked: !p.user_liked,
              likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "خطأ في التفاعل",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    refreshPosts: fetchPosts
  };
};
