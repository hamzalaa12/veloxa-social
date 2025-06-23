
import React from 'react';
import { Users, TrendingUp, Search } from 'lucide-react';
import { TrendingPosts } from './TrendingPosts';

interface SidebarProps {
  onViewChange: (view: string) => void;
  activeView: string;
  onProfileClick: (user: any) => void;
  onLike: (postId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onViewChange, activeView, onProfileClick, onLike }) => {
  const suggestions = [
    { id: 1, name: 'Emma Wilson', username: '@emmaw', followers: '2.4k', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b587?w=150&h=150&fit=crop&crop=face' },
    { id: 2, name: 'Alex Johnson', username: '@alexj', followers: '1.8k', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: 3, name: 'Sarah Davis', username: '@sarahd', followers: '3.2k', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
  ];

  return (
    <aside className="w-80 p-6 hidden lg:block space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Your avatar"
            className="w-16 h-16 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-blue-400"
          />
          <div>
            <h3 className="font-semibold text-lg">John Doe</h3>
            <p className="text-gray-600">@johndoe</p>
            <div className="flex space-x-4 text-sm text-gray-500 mt-1">
              <span>1.2k followers</span>
              <span>892 following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-semibold text-lg mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          اقتراحات المتابعة
        </h4>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h5 className="font-medium text-sm">{user.name}</h5>
                  <p className="text-gray-500 text-xs">{user.username}</p>
                  <p className="text-gray-400 text-xs">{user.followers} followers</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105">
                متابعة
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Posts Section */}
      <TrendingPosts onProfileClick={onProfileClick} onLike={onLike} />
    </aside>
  );
};
