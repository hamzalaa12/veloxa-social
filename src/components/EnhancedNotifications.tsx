
import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, Heart, MessageCircle, UserPlus, Eye, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: string;
  message?: string;
  read: boolean;
  created_at: string;
  post_id?: string;
  from_user_id?: string;
  from_profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const EnhancedNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          console.log('Notification change received:', payload);
          fetchNotifications();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          from_profiles:profiles!notifications_from_user_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      toast({
        title: "تم وضع علامة على جميع الإشعارات كمقروءة",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const fromUser = notification.from_profiles?.full_name || notification.from_profiles?.username || 'مستخدم';
    
    switch (notification.type) {
      case 'like':
        return `${fromUser} أعجب بمنشورك`;
      case 'comment':
        return `${fromUser} علق على منشورك`;
      case 'follow':
        return `${fromUser} بدأ في متابعتك`;
      default:
        return notification.message || 'إشعار جديد';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <Card className="w-96 bg-white/95 backdrop-blur-lg shadow-2xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {unreadCount > 0 ? (
                <BellRing className="w-6 h-6 text-purple-600" />
              ) : (
                <Bell className="w-6 h-6 text-gray-600" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">الإشعارات</h3>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="ghost"
              size="sm"
              className="text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-100"
            >
              <Check className="w-3 h-3 ml-1" />
              وضع علامة على الكل
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد إشعارات حتى الآن</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50/80 cursor-pointer transition-all duration-200 ${
                !notification.read ? 'bg-purple-50/50 border-l-4 border-l-purple-500' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 relative">
                  {notification.from_profiles?.avatar_url ? (
                    <div className="relative">
                      <img
                        src={notification.from_profiles.avatar_url}
                        alt={notification.from_profiles.full_name}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {getNotificationMessage(notification)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.created_at).toLocaleDateString('ar', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
