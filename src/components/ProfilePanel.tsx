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
  onViewChange?: (view: string) => void;
  onStartConversation?: (userId: string) => void;
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

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ 
  selectedUser, 
  onViewChange, 
  onStartConversation 
}) => {
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
    if (profile && onViewChange && onStartConversation) {
      onStartConversation(profile.id);
      onViewChange('messages');
    }
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
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-6 border border-gradient-to-r from-purple-200/30 to-blue-200/30">
        <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        
        <div className="px-8 pb-8">
          <div className="flex items-start justify-between -mt-16 mb-6">
            <div className="relative">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={profile.full_name}
                className="w-32 h-32 rounded-full border-6 border-white shadow-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            
            {!isOwnProfile && (
              <div className="flex space-x-3 mt-16 rtl:space-x-reverse">
                <button
                  onClick={() => selectedUser && toggleFollow(selectedUser.id)}
                  className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isUserFollowing
                      ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-purple-500/25'
                  }`}
                >
                  {isUserFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                </button>
                
                <button 
                  onClick={handleStartConversation}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>إرسال رسالة</span>
                </button>
              </div>
            )}

            {isOwnProfile && (
              <div className="mt-16">
                <button 
                  onClick={() => setProfileEditorOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Settings className="w-5 h-5" />
                  <span>تعديل الملف الشخصي</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {profile.full_name}
            </h1>
            <p className="text-gray-600 text-lg mb-4">@{profile.username}</p>
            {profile.bio && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-2xl border border-gray-200/50">
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-8 text-center rtl:space-x-reverse">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-2xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {profile.posts_count || 0}
              </div>
              <div className="text-gray-600 font-medium">المنشورات</div>
            </div>
            <div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleFollowersClick}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {profile.followers_count || 0}
              </div>
              <div className="text-gray-600 font-medium hover:text-green-600">المتابعون</div>
            </div>
            <div 
              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleFollowingClick}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {profile.following_count || 0}
              </div>
              <div className="text-gray-600 font-medium hover:text-indigo-600">يتابع</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gradient-to-r from-purple-200/30 to-blue-200/30">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 flex items-center">
          <Users className="w-6 h-6 mr-3 text-purple-600" />
          المنشورات
        </h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">لا توجد منشورات حتى الآن</p>
            <p className="text-gray-500 text-sm mt-2">ابدأ بمشاركة أول منشور لك!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => handlePostClick(post.id)}
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center p-6">
                    <p className="text-gray-700 text-center line-clamp-4 font-medium leading-relaxed">{post.content}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                  <div className="text-white p-6 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Users className="w-5 h-5" />
                          <span className="font-semibold">{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <MessageSquare className="w-5 h-5" />
                          <span className="font-semibold">{post.comments_count || 0}</span>
                        </div>
                      </div>
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
