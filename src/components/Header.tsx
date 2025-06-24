
import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, User, Users, LogOut, Bell, Search, Settings, X, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserSearch } from './UserSearch';
import { EnhancedNotifications } from './EnhancedNotifications';
import { SiteSettings } from './SiteSettings';
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
  const [showSiteSettings, setShowSiteSettings] = useState(false);
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
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gradient-to-r from-purple-200/30 to-blue-200/30 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Veloxa
              </h1>
              <p className="text-xs text-gray-500 font-medium">شبكة التواصل الذكية</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <UserSearch onUserClick={handleUserClick} />
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onViewChange('feed')}
              className={`group flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
                activeView === 'feed'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-xl scale-105 shadow-purple-500/25'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${activeView === 'feed' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="hidden md:block font-medium">الرئيسية</span>
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="group relative flex items-center space-x-2 px-5 py-3 rounded-2xl text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300"
                >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  <span className="hidden md:block font-medium">الإشعارات</span>
                </button>

                <button
                  onClick={() => onViewChange('messages')}
                  className={`group flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
                    activeView === 'messages'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl scale-105 shadow-green-500/25'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50'
                  }`}
                >
                  <MessageSquare className={`w-5 h-5 ${activeView === 'messages' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="hidden md:block font-medium">الرسائل</span>
                </button>
                
                <button
                  onClick={() => onViewChange('profile')}
                  className={`group flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
                    activeView === 'profile'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl scale-105 shadow-indigo-500/25'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                  }`}
                >
                  <User className={`w-5 h-5 ${activeView === 'profile' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="hidden md:block font-medium">الملف الشخصي</span>
                </button>

                <button
                  onClick={() => setShowSiteSettings(true)}
                  className="group flex items-center space-x-2 px-5 py-3 rounded-2xl text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                >
                  <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="hidden md:block font-medium">الإعدادات</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="group flex items-center space-x-2 px-5 py-3 rounded-2xl text-gray-600 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="hidden md:block font-medium">تسجيل الخروج</span>
                </button>
              </>
            )}

            {!user && (
              <button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white px-8 py-3 rounded-2xl hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium"
              >
                تسجيل الدخول
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Enhanced Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center pt-24">
          <div className="relative animate-fade-in">
            <EnhancedNotifications />
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Site Settings Modal */}
      <SiteSettings 
        isOpen={showSiteSettings}
        onClose={() => setShowSiteSettings(false)}
      />
    </>
  );
};
