
import React, { useState, useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useFollow } from '../hooks/useFollow';

interface SidebarProps {
  onViewChange: (view: string) => void;
  activeView: string;
  onProfileClick: (user: any) => void;
  onLike: (postId: string) => void;
  showSuggestions?: boolean;
}

interface SuggestedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  followers_count: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onViewChange, 
  activeView, 
  onProfileClick, 
  onLike,
  showSuggestions = false 
}) => {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toggleFollow, isFollowing } = useFollow();

  useEffect(() => {
    if (user && showSuggestions) {
      fetchSuggestions();
    }
  }, [user, showSuggestions]);

  const fetchSuggestions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, followers_count')
        .neq('id', user.id)
        .not('username', 'is', null)
        .not('full_name', 'is', null)
        .order('followers_count', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowClick = async (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await toggleFollow(userId);
  };

  if (!showSuggestions) {
    return (
      <aside className="w-80 p-6 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">اكتشف المحتوى في الصفحة الرئيسية</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 p-6 hidden lg:block space-y-6">
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-xl flex items-center text-gray-800">
            <UserPlus className="w-6 h-6 mr-3 text-purple-600" />
            اقتراحات المتابعة
          </h4>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">لا توجد اقتراحات متاحة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestedUser) => (
              <div key={suggestedUser.id} className="group">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-[1.02]">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                    onClick={() => onProfileClick(suggestedUser)}
                  >
                    <div className="relative">
                      <img
                        src={suggestedUser.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                        alt={suggestedUser.full_name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg group-hover:border-purple-200 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {suggestedUser.full_name}
                      </h5>
                      <p className="text-gray-500 text-sm">@{suggestedUser.username}</p>
                      <div className="flex items-center mt-1">
                        <Users className="w-3 h-3 text-gray-400 mr-1" />
                        <p className="text-gray-400 text-xs">{suggestedUser.followers_count} متابع</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleFollowClick(suggestedUser.id, e)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isFollowing(suggestedUser.id)
                        ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                    }`}
                  >
                    {isFollowing(suggestedUser.id) ? 'إلغاء المتابعة' : 'متابعة'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            اقتراحات مخصصة لك ✨
          </p>
        </div>
      </div>
    </aside>
  );
};
