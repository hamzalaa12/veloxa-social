
import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Comment } from '../hooks/useComments';
import { ActionDropdown } from './ActionDropdown';
import { useAuth } from '../hooks/useAuth';

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const { user } = useAuth();

  const isOwner = user?.id === comment.user_id;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onUpdate(comment.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
        {comment.profiles.avatar_url ? (
          <img
            src={comment.profiles.avatar_url}
            alt={comment.profiles.full_name || comment.profiles.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-sm text-gray-900">
              {comment.profiles.full_name || comment.profiles.username}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs">
                {new Date(comment.created_at).toLocaleDateString('ar')}
              </span>
              <ActionDropdown
                isOwner={isOwner}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDelete}
              />
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 text-sm border border-gray-200 rounded resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
                >
                  حفظ
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm">{comment.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
