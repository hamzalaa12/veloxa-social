
import React, { useState, useEffect } from 'react';
import { TrendingUp, Heart, MessageSquare, Share } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PostCard } from './PostCard';

interface TrendingPost {
  id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  user_liked?: boolean;
  engagement_score: number;
}

interface TrendingPostsProps {
  onProfileClick: (user: any) => void;
  onLike: (postId: string) => void;
}

export const TrendingPosts: React.FC<TrendingPostsProps> = ({ onProfileClick, onLike }) => {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      // Get posts from the last 7 days with high engagement
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('likes_count', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Calculate engagement score (likes + comments * 2)
      const postsWithEngagement = (data || []).map(post => ({
        ...post,
        engagement_score: (post.likes_count || 0) + (post.comments_count || 0) * 2
      })).sort((a, b) => b.engagement_score - a.engagement_score);

      setTrendingPosts(postsWithEngagement);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          <h3 className="text-xl font-semibold">المنشورات الرائجة</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold">المنشورات الرائجة</h3>
      </div>

      {trendingPosts.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">لا توجد منشورات رائجة حالياً</p>
        </div>
      ) : (
        <div className="space-y-6">
          {trendingPosts.map((post, index) => (
            <div key={post.id} className="relative">
              <div className="absolute -left-2 -top-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
                #{index + 1}
              </div>
              <PostCard
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
                onLike={() => onLike(post.id)}
                onProfileClick={onProfileClick}
              />
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500 bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded-lg">
                <span>نقاط التفاعل: {post.engagement_score}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
