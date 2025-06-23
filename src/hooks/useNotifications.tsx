
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow';
  from_user: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  post_id?: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      subscribeToNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // For now, we'll simulate notifications based on likes and follows
      // In a real app, you'd have a separate notifications table
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select(`
          id,
          created_at,
          post_id,
          user_id,
          profiles!likes_user_id_fkey (username, full_name, avatar_url),
          posts!likes_post_id_fkey (user_id)
        `)
        .neq('user_id', user.id);

      if (likesError) throw likesError;

      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select(`
          id,
          created_at,
          follower_id,
          profiles!follows_follower_id_fkey (username, full_name, avatar_url)
        `)
        .eq('following_id', user.id);

      if (followsError) throw followsError;

      // Transform data into notifications format
      const likeNotifications = likes
        ?.filter(like => like.posts?.user_id === user.id)
        .map(like => ({
          id: `like-${like.id}`,
          type: 'like' as const,
          from_user: like.profiles,
          post_id: like.post_id,
          read: false,
          created_at: like.created_at
        })) || [];

      const followNotifications = follows?.map(follow => ({
        id: `follow-${follow.id}`,
        type: 'follow' as const,
        from_user: follow.profiles,
        read: false,
        created_at: follow.created_at
      })) || [];

      const allNotifications = [...likeNotifications, ...followNotifications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 20);

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'likes'
      }, () => {
        fetchNotifications();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'follows'
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};
