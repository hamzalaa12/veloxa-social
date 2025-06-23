
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useVerification } from '@/hooks/useVerification';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  
  const { toast } = useToast();
  const { sendEmailVerification, verifyCode } = useVerification();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user exists with this email
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email)
        .single();

      if (error || !profiles) {
        // For security, don't reveal if email exists or not
        toast({
          title: "تم إرسال الرمز",
          description: "إذا كان هذا البريد الإلكتروني مسجل لدينا، ستتلقى رمز التحقق قريباً"
        });
        setStep('code');
        return;
      }

      // Get user by email from auth.users
      const { data: authData } = await supabase.auth.admin.listUsers();
      const user = authData.users.find(u => u.email === email);
      
      if (!user) {
        toast({
          title: "تم إرسال الرمز",
          description: "إذا كان هذا البريد الإلكتروني مسجل لدينا، ستتلقى رمز التحقق قريباً"
        });
        setStep('code');
        return;
      }

      setUserId(user.id);
      const result = await sendEmailVerification(email, user.id);
      
      if (result.success) {
        setStep('code');
      }
    } catch (error) {
      console.error('Error sending reset code:', error);
      toast({
        title: "تم إرسال الرمز",
        description: "إذا كان هذا البريد الإلكتروني مسجل لدينا، ستتلقى رمز التحقق قريباً"
      });
      setStep('code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) {
        toast({
          title: "خطأ",
          description: "يرجى إعادة المحاولة من البداية",
          variant: "destructive"
        });
        setStep('email');
        return;
      }

      const result = await verifyCode(code, userId, 'email');
      
      if (result.success) {
        setStep('password');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "تم تغيير كلمة المرور بنجاح!",
        description: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة"
      });

      // Reset form and close modal
      setStep('email');
      setEmail('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setUserId('');
      onClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setUserId('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>استرداد كلمة المرور</DialogTitle>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-gray-600 text-sm">
              أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </Button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <p className="text-gray-600 text-sm">
              أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق
              </label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <Button type="submit" disabled={loading || code.length !== 6} className="flex-1">
                {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep('email')}>
                رجوع
              </Button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-gray-600 text-sm">
              أدخل كلمة المرور الجديدة
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="كلمة المرور الجديدة"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="أعد كتابة كلمة المرور"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
