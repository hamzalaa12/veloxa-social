
import React, { useState, useEffect } from 'react';
import { Search, User, UserPlus, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useFollow } from '../hooks/useFollow';

interface SearchUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  followers_count: number;
  bio?: string;
}

interface UserSearchProps {
  onUserClick: (user: SearchUser) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onUserClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollow();

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchUsers();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, followers_count, bio')
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .neq('id', user?.id || '')
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن المستخدمين..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              لا توجد نتائج
            </div>
          ) : (
            searchResults.map((searchUser) => (
              <div
                key={searchUser.id}
                className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                onClick={() => {
                  onUserClick(searchUser);
                  setShowResults(false);
                  setSearchQuery('');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={searchUser.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                      alt={searchUser.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{searchUser.full_name}</h4>
                      <p className="text-sm text-gray-600">@{searchUser.username}</p>
                      {searchUser.bio && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{searchUser.bio}</p>
                      )}
                      <p className="text-xs text-gray-400">{searchUser.followers_count} متابع</p>
                    </div>
                  </div>
                  
                  {user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(searchUser.id);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isFollowing(searchUser.id)
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {isFollowing(searchUser.id) ? (
                        <UserCheck className="w-4 h-4" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
