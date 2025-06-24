
import React, { useState } from 'react';
import { User, Image, Video, FileText, Download, Upload, X, Sparkles, Camera } from 'lucide-react';
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
        title: "تم إنشاء المنشور بنجاح! 🎉",
        description: "تم نشر منشورك الجديد في Veloxa",
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
      link.download = 'veloxa-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم تحميل الصورة ✅",
        description: "تم تحميل الصورة بنجاح على جهازك",
      });
    }
  };

  const postTypeButtons = [
    { 
      type: 'text' as const, 
      icon: FileText, 
      label: 'نص', 
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
    },
    { 
      type: 'image' as const, 
      icon: Camera, 
      label: 'صورة', 
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600'
    },
    { 
      type: 'reel' as const, 
      icon: Video, 
      label: 'ريل', 
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100/50 p-8 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-start space-x-6">
        {/* User Avatar */}
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1">
          {/* Header with Sparkles */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ما الجديد اليوم؟
              </h3>
            </div>
          </div>

          {/* Post Type Selection - Enhanced Design */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-3">اختر نوع المنشور:</p>
            <div className="flex items-center space-x-3">
              {postTypeButtons.map(({ type, icon: Icon, label, color, hoverColor }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPostType(type)}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    postType === type
                      ? `bg-gradient-to-r ${color} text-white border-transparent shadow-lg scale-105`
                      : `border-gray-200 hover:border-gray-300 text-gray-600 hover:text-white hover:bg-gradient-to-r ${color}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Input - Enhanced */}
          <div className="mb-6">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === 'text' ? "شارك أفكارك مع مجتمع Veloxa..." :
                postType === 'image' ? "اكتب تعليقاً رائعاً على صورتك..." :
                "اكتب وصفاً مميزاً للريل..."
              }
              className="w-full min-h-[120px] border-2 border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg placeholder-gray-400 bg-gray-50/50 backdrop-blur-sm transition-all duration-300"
              onFocus={() => setIsExpanded(true)}
            />
          </div>

          {/* Image Upload Section - Enhanced */}
          {postType === 'image' && (
            <div className="mb-6">
              {!imageUrl ? (
                <div className="border-3 border-dashed border-gradient-to-r from-purple-300 to-blue-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-blue-50/50 backdrop-blur-sm">
                  {user && (
                    <ImageUploader
                      onImageUpload={handleImageUpload}
                      bucket="posts"
                      userId={user.id}
                      className="w-full"
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 mb-1">اضغط لرفع صورة مميزة</p>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF حتى 5MB</p>
                        </div>
                      </div>
                    </ImageUploader>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full max-h-96 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={downloadImage}
                        className="bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reel Section - Enhanced */}
          {postType === 'reel' && (
            <div className="mb-6">
              <div className="border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-700 mb-2">ميزة الريلز قريباً! 🎬</h3>
                <p className="text-purple-600">سيتم إضافة دعم تحميل الفيديوهات قريباً في Veloxa</p>
              </div>
            </div>
          )}

          {/* Action Buttons - Enhanced */}
          {(isExpanded || content.trim() || imageUrl) && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                {imageUrl && (
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الصورة</span>
                  </button>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setContent('');
                    setImageUrl('');
                    setPostType('text');
                    setIsExpanded(false);
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                >
                  إلغاء
                </button>
                <Button
                  type="submit"
                  disabled={!content.trim() && !imageUrl}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {postType === 'reel' ? '🎬 نشر الريل' : '✨ نشر في Veloxa'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
