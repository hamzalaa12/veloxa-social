
import React, { useState } from 'react';
import { User, Image, Video, FileText, Download, Upload, X, Sparkles, Camera } from 'lucide-react';
import { MediaUploader } from './MediaUploader';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CreatePostProps {
  onPost: (content: string, mediaUrl?: string, mediaType?: 'text' | 'image' | 'video') => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPost }) => {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video'>('text');
  const [postType, setPostType] = useState<'text' | 'image' | 'video'>('text');
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || mediaUrl) {
      onPost(content, mediaUrl || undefined, mediaType);
      setContent('');
      setMediaUrl('');
      setMediaType('text');
      setPostType('text');
      setIsExpanded(false);
      
      toast({
        title: "تم إنشاء المنشور بنجاح! 🎉",
        description: "تم نشر منشورك الجديد في Veloxa",
      });
    }
  };

  const handleMediaUpload = (url: string, type: 'image' | 'video') => {
    setMediaUrl(url);
    setMediaType(type);
    setPostType(type);
  };

  const removeMedia = () => {
    setMediaUrl('');
    setMediaType('text');
    setPostType('text');
  };

  const downloadMedia = () => {
    if (mediaUrl) {
      const link = document.createElement('a');
      link.href = mediaUrl;
      link.download = `veloxa-${mediaType}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: `تم تحميل ${mediaType === 'video' ? 'الفيديو' : 'الصورة'} ✅`,
        description: `تم تحميل ${mediaType === 'video' ? 'الفيديو' : 'الصورة'} بنجاح على جهازك`,
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
      type: 'video' as const, 
      icon: Video, 
      label: 'فيديو', 
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
                "اكتب وصفاً مميزاً للفيديو..."
              }
              className="w-full min-h-[120px] border-2 border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg placeholder-gray-400 bg-gray-50/50 backdrop-blur-sm transition-all duration-300"
              onFocus={() => setIsExpanded(true)}
            />
          </div>

          {/* Media Upload Section - Enhanced */}
          {(postType === 'image' || postType === 'video') && (
            <div className="mb-6">
              {!mediaUrl ? (
                <div className="border-3 border-dashed border-gradient-to-r from-purple-300 to-blue-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-blue-50/50 backdrop-blur-sm">
                  {user && (
                    <MediaUploader
                      onMediaUpload={handleMediaUpload}
                      bucket={postType === 'video' ? 'videos' : 'posts'}
                      userId={user.id}
                      className="w-full"
                      allowVideo={postType === 'video'}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                          {postType === 'video' ? (
                            <Video className="w-8 h-8 text-white" />
                          ) : (
                            <Upload className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 mb-1">
                            اضغط لرفع {postType === 'video' ? 'فيديو مميز' : 'صورة مميزة'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {postType === 'video' ? 'MP4, MOV, AVI حتى 50MB' : 'PNG, JPG, GIF حتى 5MB'}
                          </p>
                        </div>
                      </div>
                    </MediaUploader>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  {mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      controls
                      className="w-full max-h-96 object-cover rounded-2xl shadow-lg"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Uploaded"
                      className="w-full max-h-96 object-cover rounded-2xl shadow-lg"
                    />
                  )}
                  <div className="absolute top-4 right-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={downloadMedia}
                      className="bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="bg-red-500/90 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Enhanced */}
          {(isExpanded || content.trim() || mediaUrl) && (
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                {mediaUrl && (
                  <button
                    type="button"
                    onClick={downloadMedia}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل {mediaType === 'video' ? 'الفيديو' : 'الصورة'}</span>
                  </button>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setContent('');
                    setMediaUrl('');
                    setMediaType('text');
                    setPostType('text');
                    setIsExpanded(false);
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                >
                  إلغاء
                </button>
                <Button
                  type="submit"
                  disabled={!content.trim() && !mediaUrl}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {postType === 'video' ? '🎬 نشر الفيديو' : '✨ نشر في Veloxa'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
