
import React, { useState } from 'react';
import { Heart, MessageSquare, Share, User } from 'lucide-react';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';
import { ActionDropdown } from './ActionDropdown';
import { useAuth } from '../hooks/useAuth';

interface Post {
  id: string;
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
  onLike: (postId: string) => void;
  onShare?: (postId: string) => void;
  onProfileClick: (user: any) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onShare, onProfileClick }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  
  const { comments, loading, createComment, updateComment, deleteComment } = useComments(post.id);

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      await createComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  // Check if current user is the post owner (simplified check based on username)
  const isPostOwner = user && post.user.username.includes(user.email?.split('@')[0] || '');

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
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">{post.timeAgo}</span>
            <ActionDropdown
              isOwner={isPostOwner}
              onEdit={() => console.log('Edit post')}
              onDelete={() => console.log('Delete post')}
              onShare={() => onShare?.(post.id)}
              onReport={() => console.log('Report post')}
            />
          </div>
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
              <span className="font-medium">{comments.length}</span>
            </button>

            {onShare && (
              <button
                onClick={() => onShare(post.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors duration-200 transform hover:scale-110"
              >
                <Share className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {showComments && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            {/* Comments List */}
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">جاري تحميل التعليقات...</p>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-1 mb-4 max-h-80 overflow-y-auto">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onUpdate={updateComment}
                    onDelete={deleteComment}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">لا توجد تعليقات بعد</p>
              </div>
            )}

            {/* Add Comment Form */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 flex space-x-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب تعليقاً..."
                    className="flex-1 px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    rows={1}
                  />
                  <button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    نشر
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
