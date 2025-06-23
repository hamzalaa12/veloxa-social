
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Search } from 'lucide-react';
import { TrendingPosts } from './TrendingPosts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  onViewChange: (view: string) => void;
  activeView: string;
  onProfileClick: (user: any) => void;
  onLike: (postId: string) => void;
}

interface SuggestedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  followers_count: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onViewChange, activeView, onProfileClick, onLike }) => {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSuggestions();
    }
  }, [user]);

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

  return (
    <aside className="w-80 p-6 hidden lg:block space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-lg mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          اقتراحات المتابعة
        </h4>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            لا توجد اقتراحات متاحة
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestedUser) => (
              <div key={suggestedUser.id} className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                  onClick={() => onProfileClick(suggestedUser)}
                >
                  <img
                    src={suggestedUser.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                    alt={suggestedUser.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-medium text-sm">{suggestedUser.full_name}</h5>
                    <p className="text-gray-500 text-xs">@{suggestedUser.username}</p>
                    <p className="text-gray-400 text-xs">{suggestedUser.followers_count} متابع</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
                  متابعة
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Posts Section */}
      <TrendingPosts onProfileClick={onProfileClick} onLike={onLike} />
    </aside>
  );
};
