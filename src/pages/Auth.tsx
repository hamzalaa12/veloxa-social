import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, UserPlus, LogIn } from 'lucide-react';
import { ForgotPassword } from '@/components/ForgotPassword';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, {
          full_name: fullName,
          username: username
        });
        
        if (error) {
          toast({
            title: "خطأ في التسجيل",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "تم إنشاء الحساب بنجاح!",
            description: "يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب"
          });
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "خطأ في تسجيل الدخول",
            description: error.message,
            variant: "destructive"
          });
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-accent)] flex items-center justify-center p-4">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-[var(--shadow-elegant)] p-8 w-full max-w-md border-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-3">
            Veloxa
          </h1>
          <p className="text-muted-foreground text-lg">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="اختر اسم مستخدم"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="أدخل كلمة المرور"
                required
                minLength={6}
              />
            </div>
          </div>

          {!isSignUp && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب'}
          </button>
        </div>
      </div>

      <ForgotPassword 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
};

export default Auth;
