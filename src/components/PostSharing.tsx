
import React, { useState } from 'react';
import { Share, Copy, MessageSquare, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';

interface PostSharingProps {
  postId: string;
  onClose: () => void;
}

export const PostSharing: React.FC<PostSharingProps> = ({ postId, onClose }) => {
  const [shareText, setShareText] = useState('');
  const [sharing, setSharing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sharePost = async () => {
    if (!user) return;

    setSharing(true);
    try {
      // Create a new post that references the original post
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: shareText || 'شارك منشوراً',
          shared_post_id: postId
        });

      if (error) throw error;

      // Create notification for original post owner
      const { data: originalPost } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (originalPost && originalPost.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: originalPost.user_id,
            from_user_id: user.id,
            type: 'share',
            post_id: postId
          });
      }

      toast({
        title: "تم مشاركة المنشور بنجاح!",
      });

      onClose();
    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "خطأ في مشاركة المنشور",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setSharing(false);
    }
  };

  const copyLink = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "تم نسخ الرابط!",
        description: "يمكنك الآن مشاركته مع الآخرين"
      });
    } catch (error) {
      toast({
        title: "خطأ في نسخ الرابط",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">مشاركة المنشور</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Share with text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أضف تعليقك (اختياري)
            </label>
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="اكتب تعليقاً على المنشور..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={sharePost}
              disabled={sharing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {sharing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>مشاركة في ملفي</span>
                </>
              )}
            </button>

            <button
              onClick={copyLink}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
              title="نسخ الرابط"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Quick share options */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">مشاركة سريعة:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const text = encodeURIComponent(`شاهد هذا المنشور الرائع: ${window.location.origin}/post/${postId}`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <span className="text-sm text-gray-700">واتساب</span>
              </button>
              <button
                onClick={() => {
                  const text = encodeURIComponent(`شاهد هذا المنشور: ${window.location.origin}/post/${postId}`);
                  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
                }}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-center"
              >
                <span className="text-sm text-gray-700">تويتر</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
