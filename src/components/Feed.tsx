
import React from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

interface FeedProps {
  onProfileClick: (user: any) => void;
}

export const Feed: React.FC<FeedProps> = ({ onProfileClick }) => {
  const { posts, loading, createPost, toggleLike } = usePosts();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {user && <CreatePost onPost={createPost} />}
      
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منشورات بعد</h3>
          <p className="text-gray-600">كن أول من ينشر شيئًا!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              id: post.id,
              user: {
                name: post.profiles.full_name || post.profiles.username,
                username: `@${post.profiles.username}`,
                avatar: post.profiles.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              },
              content: post.content,
              image: post.image_url,
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              timeAgo: new Date(post.created_at).toLocaleDateString('ar'),
              liked: post.user_liked || false
            }}
            onLike={() => toggleLike(post.id)}
            onProfileClick={onProfileClick}
          />
        ))
      )}
    </div>
  );
};
