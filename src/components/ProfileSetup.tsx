
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Camera, Mail, Phone, User, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUploader } from './ImageUploader';
import { VerificationModal } from './VerificationModal';

interface ProfileSetupProps {
  onComplete: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email');
  const [contactForVerification, setContactForVerification] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    bio: '',
    phone: '',
    avatarUrl: '',
    coverUrl: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.username.trim() || !formData.fullName.trim()) {
        toast({
          title: "معلومات مطلوبة",
          description: "يرجى ملء اسم المستخدم والاسم الكامل",
          variant: "destructive"
        });
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleVerification = (type: 'email' | 'phone') => {
    setVerificationType(type);
    setContactForVerification(type === 'email' ? user?.email || '' : formData.phone);
    setShowVerificationModal(true);
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.fullName,
          bio: formData.bio,
          phone: formData.phone,
          avatar_url: formData.avatarUrl,
          cover_url: formData.coverUrl,
          profile_completed: true
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "تم إنشاء الملف الشخصي!",
        description: "مرحباً بك في منصتنا الاجتماعية"
      });

      onComplete();
    } catch (error) {
      console.error('Error completing profile setup:', error);
      toast({
        title: "خطأ في إنشاء الملف الشخصي",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">إعداد الملف الشخصي</CardTitle>
          <p className="text-gray-600">الخطوة {step} من 4</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">المعلومات الأساسية</h3>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center space-x-2 space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>اسم المستخدم</span>
                </Label>
                <Input
                  id="username"
                  placeholder="اختر اسم مستخدم فريد"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center space-x-2 space-x-reverse">
                  <User className="w-4 h-4" />
                  <span>الاسم الكامل</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center space-x-2 space-x-reverse">
                  <FileText className="w-4 h-4" />
                  <span>نبذة عنك (اختياري)</span>
                </Label>
                <Textarea
                  id="bio"
                  placeholder="اكتب نبذة مختصرة عنك..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">معلومات الاتصال</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">البريد الإلكتروني</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleVerification('email')}>
                      تأكيد
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4" />
                    <span>رقم الهاتف (اختياري)</span>
                  </Label>
                  <div className="flex space-x-2 space-x-reverse">
                    <Input
                      id="phone"
                      placeholder="+966 50 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1"
                    />
                    {formData.phone && (
                      <Button variant="outline" size="sm" onClick={() => handleVerification('phone')}>
                        تأكيد
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">الصور الشخصية</h3>
              
              <div className="space-y-6">
                <div className="text-center">
                  <Label className="block text-sm font-medium mb-2">صورة الملف الشخصي</Label>
                  <div className="relative w-32 h-32 mx-auto">
                    {formData.avatarUrl ? (
                      <ImageUploader
                        onImageUpload={(url) => handleInputChange('avatarUrl', url)}
                        currentImage={formData.avatarUrl}
                        bucket="avatars"
                        userId={user.id}
                      >
                        <img
                          src={formData.avatarUrl}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full transition-all cursor-pointer">
                          <Camera className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </ImageUploader>
                    ) : (
                      <ImageUploader
                        onImageUpload={(url) => handleInputChange('avatarUrl', url)}
                        bucket="avatars"
                        userId={user.id}
                      >
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center cursor-pointer hover:from-blue-500 hover:to-purple-600 transition-colors">
                          <Camera className="w-12 h-12 text-white" />
                        </div>
                      </ImageUploader>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">صورة الغلاف (اختياري)</Label>
                  {formData.coverUrl ? (
                    <ImageUploader
                      onImageUpload={(url) => handleInputChange('coverUrl', url)}
                      currentImage={formData.coverUrl}
                      bucket="avatars"
                      userId={user.id}
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                        <img
                          src={formData.coverUrl}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all">
                          <Camera className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </ImageUploader>
                  ) : (
                    <ImageUploader
                      onImageUpload={(url) => handleInputChange('coverUrl', url)}
                      bucket="avatars"
                      userId={user.id}
                    >
                      <div className="h-32 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer hover:from-gray-300 hover:to-gray-400 transition-colors">
                        <div className="text-center">
                          <Camera className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                          <p className="text-sm text-gray-600">اضغط لإضافة صورة غلاف</p>
                        </div>
                      </div>
                    </ImageUploader>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">مراجعة المعلومات</h3>
              
              <div className="space-y-4 text-right">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p><strong>اسم المستخدم:</strong> {formData.username}</p>
                  <p><strong>الاسم الكامل:</strong> {formData.fullName}</p>
                  {formData.bio && <p><strong>النبذة:</strong> {formData.bio}</p>}
                  {formData.phone && <p><strong>الهاتف:</strong> {formData.phone}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(prev => prev - 1)}>
                السابق
              </Button>
            )}
            
            <div className="mr-auto">
              {step < 4 ? (
                <Button onClick={handleNextStep}>
                  التالي
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? 'جاري الإنشاء...' : 'إنهاء الإعداد'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        type={verificationType}
        contactInfo={contactForVerification}
      />
    </div>
  );
};
