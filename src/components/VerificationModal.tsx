
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVerification } from '@/hooks/useVerification';
import { useAuth } from '@/hooks/useAuth';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'email' | 'phone';
  contactInfo: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  type,
  contactInfo
}) => {
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const { sendEmailVerification, sendPhoneVerification, verifyCode, loading } = useVerification();
  const { user } = useAuth();

  const handleSendCode = async () => {
    if (!user) return;

    if (type === 'email') {
      const result = await sendEmailVerification(contactInfo, user.id);
      if (result.success) {
        setStep('verify');
      }
    } else {
      const result = await sendPhoneVerification(contactInfo, user.id);
      if (result.success) {
        setStep('verify');
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!user) return;

    const result = await verifyCode(code, user.id, type);
    if (result.success) {
      onClose();
      setStep('send');
      setCode('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {type === 'email' ? 'تأكيد البريد الإلكتروني' : 'تأكيد رقم الهاتف'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'send' ? (
            <>
              <p className="text-gray-600">
                سيتم إرسال رمز التحقق إلى: <span className="font-semibold">{contactInfo}</span>
              </p>
              <Button onClick={handleSendCode} disabled={loading} className="w-full">
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                يرجى إدخال الرمز المرسل إلى {contactInfo}
              </p>
              <Input
                type="text"
                placeholder="أدخل الرمز المكون من 6 أرقام"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <div className="flex space-x-2 space-x-reverse">
                <Button onClick={handleVerifyCode} disabled={loading || code.length !== 6} className="flex-1">
                  {loading ? 'جاري التحقق...' : 'تأكيد'}
                </Button>
                <Button variant="outline" onClick={handleSendCode} disabled={loading}>
                  إعادة إرسال
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
