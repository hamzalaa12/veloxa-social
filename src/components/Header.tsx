
import React from 'react';
import { Heart, MessageSquare, User, Users, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onViewChange: (view: string) => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, activeView }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SocialGrid
          </h1>
        </div>
        
        <nav className="flex items-center space-x-6">
          <button
            onClick={() => onViewChange('feed')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeView === 'feed'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="hidden md:block">الرئيسية</span>
          </button>
          
          {user && (
            <>
              <button
                onClick={() => onViewChange('messages')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'messages'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden md:block">الرسائل</span>
              </button>
              
              <button
                onClick={() => onViewChange('profile')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === 'profile'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block">الملف الشخصي</span>
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:block">تسجيل الخروج</span>
              </button>
            </>
          )}

          {!user && (
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
            >
              تسجيل الدخول
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
