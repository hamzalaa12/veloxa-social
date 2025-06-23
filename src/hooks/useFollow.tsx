
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useFollow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const fetchFollowing = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;

      setFollowing(new Set(data.map(follow => follow.following_id)));
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (targetUserId: string) => {
    if (!user) return;

    const isCurrentlyFollowing = following.has(targetUserId);

    try {
      if (isCurrentlyFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;

        setFollowing(prev => {
          const newFollowing = new Set(prev);
          newFollowing.delete(targetUserId);
          return newFollowing;
        });

        toast({
          title: "تم إلغاء المتابعة",
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId
          });

        if (error) throw error;

        setFollowing(prev => new Set(prev).add(targetUserId));

        toast({
          title: "تمت المتابعة بنجاح!",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "خطأ في المتابعة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const isFollowing = (userId: string) => following.has(userId);

  return {
    following,
    loading,
    toggleFollow,
    isFollowing,
    refreshFollowing: fetchFollowing
  };
};
