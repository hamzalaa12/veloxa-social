
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, User, Users, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserSearch } from './UserSearch';
import { EnhancedNotifications } from './EnhancedNotifications';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  onViewChange: (view: string) => void;
  activeView: string;
  onUserClick?: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, activeView, onUserClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      subscribeToNotifications();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const subscribeToNotifications = () => {
    if (!user) return;

    const channel = supabase
      .channel('header-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleUserClick = (searchUser: any) => {
    if (onUserClick) {
      onUserClick(searchUser);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SocialGrid
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <UserSearch onUserClick={handleUserClick} />
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onViewChange('feed')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeView === 'feed'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="hidden md:block">الرئيسية</span>
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  <span className="hidden md:block">الإشعارات</span>
                </button>

                <button
                  onClick={() => onViewChange('messages')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === 'messages'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden md:block">الرسائل</span>
                </button>
                
                <button
                  onClick={() => onViewChange('profile')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === 'profile'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">الملف الشخصي</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:block">تسجيل الخروج</span>
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
              >
                تسجيل الدخول
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Enhanced Notifications Modal */}
      {showNotifications && (
        <EnhancedNotifications onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};
