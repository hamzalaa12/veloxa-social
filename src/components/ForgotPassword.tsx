
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useVerification } from '@/hooks/useVerification';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [simulatedCode, setSimulatedCode] = useState<string>('');
  
  const { toast } = useToast();
  const { sendEmailVerification, verifyCode } = useVerification();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        description: "يرجى التحقق من بريدك الإلكتروني واتباع الرابط المرسل"
      });
      
      // Close the modal after successful email send
      handleClose();
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: "خطأ في إرسال البريد الإلكتروني",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
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

      // For demo purposes, check if the entered code matches the simulated code
      if (code === simulatedCode) {
        toast({
          title: "تم التحقق من الرمز بنجاح!",
          description: "يمكنك الآن إدخال كلمة المرور الجديدة"
        });
        setStep('password');
      } else {
        toast({
          title: "رمز غير صحيح",
          description: "يرجى التحقق من الرمز والمحاولة مرة أخرى",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "خطأ في التحقق",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
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
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
      setSimulatedCode('');
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
    setSimulatedCode('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg mx-4" dir="rtl">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            استرداد كلمة المرور
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">
                  أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 pr-4 py-3 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all"
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !email} 
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    'إرسال رمز التحقق'
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  أدخل رمز التحقق المرسل إلى بريدك الإلكتروني
                </p>
                {simulatedCode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-yellow-800">
                      <strong>رمز التجربة:</strong> {simulatedCode}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    رمز التحقق
                  </label>
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest h-14 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-gray-50 focus:bg-white font-mono"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex space-x-3 space-x-reverse">
                  <Button 
                    type="submit" 
                    disabled={loading || code.length !== 6} 
                    className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري التحقق...</span>
                      </div>
                    ) : (
                      'تأكيد الرمز'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('email')}
                    className="px-6 h-12 border-2 rounded-xl hover:bg-gray-50"
                  >
                    رجوع
                  </Button>
                </div>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">
                  أدخل كلمة المرور الجديدة
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-12 pr-12 py-3 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all"
                      placeholder="كلمة المرور الجديدة"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 py-3 h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-gray-50 focus:bg-white transition-all"
                      placeholder="أعد كتابة كلمة المرور"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>كلمات المرور غير متطابقة</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword} 
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري التحديث...</span>
                    </div>
                  ) : (
                    'تحديث كلمة المرور'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
