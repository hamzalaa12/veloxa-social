
import React, { useState } from 'react';
import { User } from 'lucide-react';

interface CreatePostProps {
  onPost: (content: string, image?: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onPost(content, imageUrl || undefined);
      setContent('');
      setImageUrl('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border-0 resize-none focus:ring-0 outline-none text-lg placeholder-gray-400"
            rows={3}
          />
          
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Add an image URL (optional)"
            className="w-full px-4 py-2 mt-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!content.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
