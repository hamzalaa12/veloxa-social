
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendVerificationEmail, sendSMSVerification } from '@/services/emailService';

export const useVerification = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendEmailVerification = async (email: string, userId: string) => {
    setLoading(true);
    try {
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update user profile with verification code
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_code: code,
          verification_code_expires_at: expiresAt.toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // Send email (in real app, this would send actual email)
      await sendVerificationEmail(email, code);

      toast({
        title: "تم إرسال رمز التحقق",
        description: "يرجى التحقق من بريدك الإلكتروني"
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending verification:', error);
      toast({
        title: "خطأ في إرسال الرمز",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneVerification = async (phone: string, userId: string) => {
    setLoading(true);
    try {
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      const { error } = await supabase
        .from('profiles')
        .update({
          verification_code: code,
          verification_code_expires_at: expiresAt.toISOString(),
          phone: phone
        })
        .eq('id', userId);

      if (error) throw error;

      await sendSMSVerification(phone, code);

      toast({
        title: "تم إرسال رمز التحقق",
        description: "يرجى التحقق من رسائلك النصية"
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending SMS verification:', error);
      toast({
        title: "خطأ في إرسال الرمز",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string, userId: string, type: 'email' | 'phone') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('verification_code, verification_code_expires_at')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (!data.verification_code || data.verification_code !== code) {
        toast({
          title: "رمز غير صحيح",
          description: "يرجى التحقق من الرمز والمحاولة مرة أخرى",
          variant: "destructive"
        });
        return { success: false };
      }

      const expiresAt = new Date(data.verification_code_expires_at);
      if (expiresAt < new Date()) {
        toast({
          title: "انتهت صلاحية الرمز",
          description: "يرجى طلب رمز جديد",
          variant: "destructive"
        });
        return { success: false };
      }

      // Update verification status
      const updateData = {
        verification_code: null,
        verification_code_expires_at: null,
        ...(type === 'email' ? { email_verified: true } : { phone_verified: true })
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "تم التحقق بنجاح!",
        description: type === 'email' ? "تم تأكيد بريدك الإلكتروني" : "تم تأكيد رقم هاتفك"
      });

      return { success: true };
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "خطأ في التحقق",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmailVerification,
    sendPhoneVerification,
    verifyCode,
    loading
  };
};
