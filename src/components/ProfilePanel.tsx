import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Users, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFollow } from '../hooks/useFollow';
import { supabase } from '@/integrations/supabase/client';
import { FollowModal } from './FollowModal';
import { PostDetailModal } from './PostDetailModal';
import { ProfileEditor } from './ProfileEditor';

interface ProfilePanelProps {
  selectedUser?: any;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ selectedUser }) => {
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollow();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');
  const [postDetailModalOpen, setPostDetailModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [selectedUser, user]);

  const fetchProfile = async () => {
    const targetUserId = selectedUser?.id || user?.id;
    if (!targetUserId) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);

      // Fetch user's posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      setUserPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = () => {
    console.log('Start conversation with:', profile?.username);
  };

  const handleFollowersClick = () => {
    setFollowModalType('followers');
    setFollowModalOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowModalType('following');
    setFollowModalOpen(true);
  };

  const handlePostClick = (postId: string) => {
    setSelectedPostId(postId);
    setPostDetailModalOpen(true);
  };

  const handleLike = () => {
    // This would be handled by the post detail modal
    console.log('Like post');
  };

  const handleShare = () => {
    console.log('Share post');
  };

  const handleUserClick = (clickedUser: any) => {
    // This would navigate to the clicked user's profile
    console.log('Navigate to user:', clickedUser);
  };

  const handleProfileEditorComplete = () => {
    setProfileEditorOpen(false);
    fetchProfile(); // Refresh profile data after editing
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="px-8 pb-8">
            <div className="flex items-start justify-between -mt-16 mb-6">
              <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600">المستخدم غير موجود</p>
      </div>
    );
  }

  const isOwnProfile = user?.id === profile.id;
  const isUserFollowing = selectedUser ? isFollowing(selectedUser.id) : false;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
        
        <div className="px-8 pb-8">
          <div className="flex items-start justify-between -mt-16 mb-6">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
              alt={profile.full_name}
              className="w-32 h-32 rounded-full border-6 border-white shadow-lg object-cover"
            />
            
            {!isOwnProfile && (
              <div className="flex space-x-3 mt-16">
                <button
                  onClick={() => selectedUser && toggleFollow(selectedUser.id)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    isUserFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                  }`}
                >
                  {isUserFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                </button>
                
                <button 
                  onClick={handleStartConversation}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>رسالة</span>
                </button>
              </div>
            )}

            {isOwnProfile && (
              <div className="mt-16">
                <button 
                  onClick={() => setProfileEditorOpen(true)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>تعديل الملف الشخصي</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.full_name}</h1>
            <p className="text-gray-600 mb-4">@{profile.username}</p>
            {profile.bio && (
              <p className="text-gray-700 leading-relaxed mb-4">{profile.bio}</p>
            )}
          </div>
          
          <div className="flex space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{profile.posts_count || 0}</div>
              <div className="text-gray-600">المنشورات</div>
            </div>
            <div 
              className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={handleFollowersClick}
            >
              <div className="text-2xl font-bold text-gray-900">{profile.followers_count || 0}</div>
              <div className="text-gray-600 hover:text-purple-600">المتابعون</div>
            </div>
            <div 
              className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={handleFollowingClick}
            >
              <div className="text-2xl font-bold text-gray-900">{profile.following_count || 0}</div>
              <div className="text-gray-600 hover:text-purple-600">يتابع</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">المنشورات</h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد منشورات حتى الآن</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                className="relative group cursor-pointer"
                onClick={() => handlePostClick(post.id)}
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-700 text-center p-4 line-clamp-3 font-medium">{post.content}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">{post.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">{post.comments_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Follow Modal */}
      <FollowModal
        isOpen={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
        userId={profile.id}
        type={followModalType}
        onUserClick={handleUserClick}
      />

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          isOpen={postDetailModalOpen}
          onClose={() => setPostDetailModalOpen(false)}
          postId={selectedPostId}
          onLike={handleLike}
          onShare={handleShare}
          onProfileClick={handleUserClick}
        />
      )}

      {/* Profile Editor Modal */}
      <ProfileEditor 
        isOpen={profileEditorOpen}
        onClose={handleProfileEditorComplete}
      />
    </div>
  );
};
