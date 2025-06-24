
import React, { useState } from 'react';
import { User, Image, Video, FileText, Download, Upload, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  onPost: (content: string, image?: string, type?: 'text' | 'image' | 'reel') => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'reel'>('text');
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || imageUrl) {
      onPost(content, imageUrl || undefined, postType);
      setContent('');
      setImageUrl('');
      setPostType('text');
      setIsExpanded(false);
      
      toast({
        title: "تم إنشاء المنشور بنجاح!",
        description: "تم نشر منشورك الجديد",
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setPostType('image');
  };

  const removeImage = () => {
    setImageUrl('');
    setPostType('text');
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم تحميل الصورة",
        description: "تم تحميل الصورة بنجاح",
      });
    }
  };

  const postTypeButtons = [
    { type: 'text' as const, icon: FileText, label: 'نص', color: 'text-blue-600' },
    { type: 'image' as const, icon: Image, label: 'صورة', color: 'text-green-600' },
    { type: 'reel' as const, icon: Video, label: 'ريل', color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1">
          {/* Post Type Selection */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium text-gray-600 ml-2">نوع المنشور:</span>
            {postTypeButtons.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => setPostType(type)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                  postType === type
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${postType === type ? 'text-purple-600' : color}`} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>

          {/* Content Input */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'text' ? "ما الذي تفكر فيه؟" :
              postType === 'image' ? "اكتب تعليقاً على الصورة..." :
              "اكتب وصفاً للريل..."
            }
            className="w-full mb-4 min-h-[100px] border-0 resize-none focus:ring-2 focus:ring-purple-500 outline-none text-lg placeholder-gray-400"
            onFocus={() => setIsExpanded(true)}
          />

          {/* Image Upload Section */}
          {postType === 'image' && (
            <div className="mb-4">
              {!imageUrl ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  {user && (
                    <ImageUploader
                      onImageUpload={handleImageUpload}
                      bucket="posts"
                      userId={user.id}
                      className="w-full"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <span className="text-gray-600">اضغط لرفع صورة</span>
                        <span className="text-sm text-gray-400">PNG, JPG, GIF حتى 5MB</span>
                      </div>
                    </ImageUploader>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full max-h-96 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={downloadImage}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reel Upload Section */}
          {postType === 'reel' && (
            <div className="mb-4">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50">
                <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <span className="text-purple-700 font-medium">ميزة الريلز قريباً!</span>
                <p className="text-sm text-purple-600 mt-1">سيتم إضافة دعم تحميل الفيديوهات قريباً</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(isExpanded || content.trim() || imageUrl) && (
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                {imageUrl && (
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الصورة</span>
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setContent('');
                    setImageUrl('');
                    setPostType('text');
                    setIsExpanded(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <Button
                  type="submit"
                  disabled={!content.trim() && !imageUrl}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {postType === 'reel' ? 'نشر الريل' : 'نشر'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
