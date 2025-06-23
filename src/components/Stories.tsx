
import React, { useState, useEffect } from 'react';
import { Plus, Play, X, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ImageUploader } from './ImageUploader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Story {
  id: string;
  user_id: string;
  image_url: string;
  text?: string;
  created_at: string;
  expires_at: string;
  views_count: number;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyText, setStoryText] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const createStory = async (imageUrl: string) => {
    if (!user) return;

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Stories expire after 24 hours

      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          text: storyText,
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      setShowCreateStory(false);
      setStoryText('');
      fetchStories();
      toast({
        title: "تم إنشاء القصة بنجاح!",
        description: "سيتم حذف القصة بعد 24 ساعة"
      });
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: "خطأ في إنشاء القصة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const viewStory = async (story: Story) => {
    setSelectedStory(story);
    
    // Increment view count
    if (story.user_id !== user?.id) {
      await supabase
        .from('stories')
        .update({ views_count: story.views_count + 1 })
        .eq('id', story.id);
    }
  };

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    const userId = story.user_id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">القصص</h3>
      
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Add Story Button */}
        {user && (
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowCreateStory(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              <Plus className="w-6 h-6" />
            </button>
            <p className="text-xs text-center mt-2 text-gray-600">إضافة قصة</p>
          </div>
        )}

        {/* Stories */}
        {Object.entries(groupedStories).map(([userId, userStories]) => {
          const firstStory = userStories[0];
          return (
            <div key={userId} className="flex-shrink-0">
              <button
                onClick={() => viewStory(firstStory)}
                className="relative w-16 h-16 rounded-full border-4 border-gradient-to-r from-purple-500 to-blue-500 overflow-hidden hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={firstStory.profiles.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt={firstStory.profiles.full_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </button>
              <p className="text-xs text-center mt-2 text-gray-600 truncate w-16">
                {firstStory.profiles.username}
              </p>
            </div>
          );
        })}
      </div>

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">إنشاء قصة جديدة</h3>
              <button
                onClick={() => setShowCreateStory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="اكتب نصاً للقصة (اختياري)..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none"
              rows={3}
            />

            <ImageUploader
              onImageUpload={createStory}
              bucket="posts"
              userId={user?.id || ''}
              className="w-full"
            >
              <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 transition-colors duration-200">
                <div className="text-purple-500 mb-2">
                  <Plus className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-gray-600">اختر صورة للقصة</p>
              </div>
            </ImageUploader>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setSelectedStory(null)}
            className="absolute top-4 right-4 text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-md mx-4">
            <img
              src={selectedStory.image_url}
              alt="Story"
              className="w-full h-screen object-cover rounded-lg"
            />
            
            {selectedStory.text && (
              <div className="absolute bottom-20 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <p>{selectedStory.text}</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <img
                  src={selectedStory.profiles.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                  alt={selectedStory.profiles.full_name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{selectedStory.profiles.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{selectedStory.views_count}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
