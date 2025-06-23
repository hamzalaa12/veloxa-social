
import React from 'react';
import { Heart, MessageSquare, User, Users } from 'lucide-react';

interface HeaderProps {
  onViewChange: (view: string) => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, activeView }) => {
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
            <span className="hidden md:block">Feed</span>
          </button>
          
          <button
            onClick={() => onViewChange('messages')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeView === 'messages'
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden md:block">Messages</span>
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
            <span className="hidden md:block">Profile</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
