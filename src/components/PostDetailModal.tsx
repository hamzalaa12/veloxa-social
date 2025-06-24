
import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Share, User } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { CommentItem } from './CommentItem';
import { ActionDropdown } from './ActionDropdown';

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onLike: () => void;
  onShare: () => void;
  onProfileClick: (user: any) => void;
}

interface PostDetail {
  id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  user_liked: boolean;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  postId,
  onLike,
  onShare,
  onProfileClick
}) => {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { comments, loading: commentsLoading, createComment, updateComment, deleteComment } = useComments(postId);

  useEffect(() => {
    if (isOpen && postId) {
      fetchPost();
    }
  }, [isOpen, postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
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
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Check if user liked this post
      if (user && data) {
        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .single();

        setPost({
          ...data,
          user_liked: !!likeData
        });
      } else {
        setPost({ ...data, user_liked: false });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await createComment(newComment.trim());
    setNewComment('');
  };

  const isOwner = user?.id === post?.user_id;

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="animate-pulse p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => onProfileClick({ id: post.user_id, ...post.profiles })}
              >
                {post.profiles.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 
                  className="font-semibold text-gray-900 cursor-pointer hover:text-purple-600"
                  onClick={() => onProfileClick({ id: post.user_id, ...post.profiles })}
                >
                  {post.profiles.full_name || post.profiles.username}
                </h3>
                <p className="text-sm text-gray-500">@{post.profiles.username}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleDateString('ar')}
                </p>
              </div>
            </div>
            <ActionDropdown
              isOwner={isOwner}
              onShare={onShare}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post content"
                  className="w-full max-h-96 object-cover rounded-xl mb-4"
                />
              )}
              <p className="text-gray-800 leading-relaxed mb-6">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center justify-between border-y py-4 mb-6">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={onLike}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.user_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${post.user_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes_count}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{post.comments_count}</span>
                  </div>
                </div>
                <button
                  onClick={onShare}
                  className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-colors"
                >
                  <Share className="w-6 h-6" />
                  <span>مشاركة</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">التعليقات</h4>
                
                {/* Add Comment Form */}
                {user && (
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب تعليقك..."
                      className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      نشر التعليق
                    </button>
                  </form>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-3 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد تعليقات حتى الآن</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onUpdate={updateComment}
                        onDelete={deleteComment}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
