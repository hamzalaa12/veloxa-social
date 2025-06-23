
import React, { useState } from 'react';
import { Heart, MessageSquare, Share, User } from 'lucide-react';

interface Post {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  liked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onProfileClick: (user: any) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onProfileClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const comments = [
    { id: 1, user: 'Mike Chen', content: 'Amazing shot! 📸', timeAgo: '1h' },
    { id: 2, user: 'Lisa Park', content: 'Looks incredible! Where is this?', timeAgo: '45m' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onProfileClick(post.user)}
          >
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
              <p className="text-gray-500 text-sm">{post.user.username}</p>
            </div>
          </div>
          <span className="text-gray-400 text-sm">{post.timeAgo}</span>
        </div>

        <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 transition-all duration-200 transform hover:scale-110 ${
                post.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${post.liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-200 transform hover:scale-110"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="font-medium">{post.comments}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors duration-200 transform hover:scale-110">
              <Share className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-sm text-gray-900">{comment.user}</p>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                    <span className="text-gray-400 text-xs ml-3">{comment.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200">
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
