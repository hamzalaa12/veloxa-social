
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "خطأ في جلب التعليقات",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
          user_id: user.id
        });

      if (error) throw error;

      fetchComments(); // Refresh comments
      toast({
        title: "تم نشر التعليق بنجاح!",
        description: "تم إضافة تعليقك الجديد"
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "خطأ في نشر التعليق",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);

      if (error) throw error;

      fetchComments(); // Refresh comments
      toast({
        title: "تم تحديث التعليق بنجاح!",
        description: "تم حفظ تعديلاتك"
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "خطأ في تحديث التعليق",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      fetchComments(); // Refresh comments
      toast({
        title: "تم حذف التعليق بنجاح!",
        description: "تم إزالة التعليق"
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "خطأ في حذف التعليق",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    createComment,
    updateComment,
    deleteComment,
    refreshComments: fetchComments
  };
};
