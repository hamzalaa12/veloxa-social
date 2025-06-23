
import React, { useState, useEffect } from 'react';
import { User, Camera, Save, X, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    phone: '',
    avatar_url: '',
    cover_url: ''
  });

  useEffect(() => {
    if (user && isOpen) {
      fetchProfile();
    }
  }, [user, isOpen]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          cover_url: data.cover_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات الملف الشخصي",
        variant: "destructive"
      });
    }
  };

  const uploadImage = async (file: File, bucket: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const imageUrl = await uploadImage(file, 'avatars');
      if (imageUrl) {
        setFormData(prev => ({
          ...prev,
          [type === 'avatar' ? 'avatar_url' : 'cover_url']: imageUrl
        }));
        toast({
          title: "تم الرفع",
          description: "تم رفع الصورة بنجاح"
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          phone: formData.phone,
          avatar_url: formData.avatar_url,
          cover_url: formData.cover_url,
          profile_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "تم الحفظ",
        description: "تم حفظ بيانات الملف الشخصي بنجاح"
      });

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ بيانات الملف الشخصي",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">تعديل الملف الشخصي</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>صورة الغلاف</Label>
            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg overflow-hidden">
              {formData.cover_url && (
                <img 
                  src={formData.cover_url} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <label className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <Label>الصورة الشخصية</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-purple-500 hover:bg-purple-600 rounded-full p-1 cursor-pointer transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'avatar')}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="اسم المستخدم"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">الاسم الكامل</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="الاسم الكامل"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="رقم الهاتف"
              type="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">النبذة الشخصية</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="اكتب نبذة عنك..."
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading || uploading}
              className="flex-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
