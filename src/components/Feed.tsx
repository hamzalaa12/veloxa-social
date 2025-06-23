
import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';

interface FeedProps {
  onProfileClick: (user: any) => void;
}

export const Feed: React.FC<FeedProps> = ({ onProfileClick }) => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'Emma Wilson',
        username: '@emmaw',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b587?w=150&h=150&fit=crop&crop=face'
      },
      content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking 🏔️✨',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      likes: 234,
      comments: 18,
      timeAgo: '2 hours ago',
      liked: false
    },
    {
      id: 2,
      user: {
        name: 'Alex Johnson',
        username: '@alexj',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      content: 'Working on some new design concepts. What do you think about this color palette?',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      likes: 89,
      comments: 12,
      timeAgo: '4 hours ago',
      liked: true
    },
    {
      id: 3,
      user: {
        name: 'Sarah Davis',
        username: '@sarahd',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      content: 'Coffee and code - perfect combination for a productive morning ☕💻',
      likes: 156,
      comments: 23,
      timeAgo: '6 hours ago',
      liked: false
    }
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleNewPost = (content: string, image?: string) => {
    const newPost = {
      id: posts.length + 1,
      user: {
        name: 'John Doe',
        username: '@johndoe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      content,
      image,
      likes: 0,
      comments: 0,
      timeAgo: 'now',
      liked: false
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <CreatePost onPost={handleNewPost} />
      
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onProfileClick={onProfileClick}
        />
      ))}
    </div>
  );
};
