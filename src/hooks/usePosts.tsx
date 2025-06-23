
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  content: string;
  image_url?: string;
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
          user_liked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(data || []);
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

  const createPost = async (content: string, imageUrl?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content,
          image_url: imageUrl,
          user_id: user.id
        });

      if (error) throw error;

      fetchPosts(); // Refresh posts
      toast({
        title: "تم نشر المنشور بنجاح!",
        description: "تم إضافة منشورك الجديد"
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
