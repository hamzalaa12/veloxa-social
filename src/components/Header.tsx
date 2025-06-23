
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, User, Users, LogOut, Bell, Search, Settings, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserSearch } from './UserSearch';
import { EnhancedNotifications } from './EnhancedNotifications';
import { ProfileEditor } from './ProfileEditor';
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
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const cleanup = subscribeToNotifications();
      return cleanup;
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
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SocialGrid
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <UserSearch onUserClick={handleUserClick} />
          </div>
          
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('feed')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                activeView === 'feed'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="hidden md:block">الرئيسية</span>
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50/80 transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  <span className="hidden md:block">الإشعارات</span>
                </button>

                <button
                  onClick={() => onViewChange('messages')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeView === 'messages'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="hidden md:block">الرسائل</span>
                </button>
                
                <button
                  onClick={() => onViewChange('profile')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeView === 'profile'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/80'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">الملف الشخصي</span>
                </button>

                <button
                  onClick={() => setShowProfileEditor(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all duration-300"
                >
                  <Settings className="w-5 h-5" />
                  <span className="hidden md:block">الإعدادات</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50/80 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:block">تسجيل الخروج</span>
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                تسجيل الدخول
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Enhanced Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="relative">
            <EnhancedNotifications />
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Profile Editor Modal */}
      <ProfileEditor 
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
      />
    </>
  );
};
