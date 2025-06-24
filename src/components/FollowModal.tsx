
import React, { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useFollow } from '../hooks/useFollow';

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: 'followers' | 'following';
  onUserClick: (user: any) => void;
}

interface FollowUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  followers_count: number;
}

export const FollowModal: React.FC<FollowModalProps> = ({
  isOpen,
  onClose,
  userId,
  type,
  onUserClick
}) => {
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollow();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query;

      if (type === 'followers') {
        query = supabase
          .from('follows')
          .select(`
            follower_id,
            profiles!follows_follower_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              followers_count
            )
          `)
          .eq('following_id', userId);
      } else {
        query = supabase
          .from('follows')
          .select(`
            following_id,
            profiles!follows_following_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              followers_count
            )
          `)
          .eq('follower_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const usersList = data?.map(item => {
        const profile = type === 'followers' ? item.profiles : item.profiles;
        return {
          id: profile.id,
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          followers_count: profile.followers_count
        };
      }) || [];

      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (clickedUser: FollowUser) => {
    onUserClick(clickedUser);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {type === 'followers' ? 'المتابعون' : 'يتابع'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {type === 'followers' ? 'لا يوجد متابعون' : 'لا يتابع أحد'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((followUser) => (
                <div
                  key={followUser.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleUserClick(followUser)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                      {followUser.avatar_url ? (
                        <img
                          src={followUser.avatar_url}
                          alt={followUser.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {followUser.full_name || followUser.username}
                      </p>
                      <p className="text-sm text-gray-500">@{followUser.username}</p>
                      <p className="text-xs text-gray-400">
                        {followUser.followers_count} متابع
                      </p>
                    </div>
                  </div>
                  
                  {user && user.id !== followUser.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(followUser.id);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isFollowing(followUser.id)
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                      }`}
                    >
                      {isFollowing(followUser.id) ? 'إلغاء المتابعة' : 'متابعة'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
