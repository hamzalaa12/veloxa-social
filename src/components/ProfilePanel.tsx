
import React, { useState } from 'react';
import { MessageSquare, User, Users } from 'lucide-react';

interface ProfilePanelProps {
  selectedUser?: any;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ selectedUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  const currentUser = selectedUser || {
    name: 'John Doe',
    username: '@johndoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate developer and designer. Love creating beautiful digital experiences.',
    followers: 1234,
    following: 892,
    posts: 156
  };

  const userPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop', likes: 234 },
    { id: 2, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop', likes: 89 },
    { id: 3, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&h=300&fit=crop', likes: 156 },
    { id: 4, image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300&h=300&fit=crop', likes: 203 },
    { id: 5, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop', likes: 178 },
    { id: 6, image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop', likes: 267 },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
        
        <div className="px-8 pb-8">
          <div className="flex items-start justify-between -mt-16 mb-6">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-32 h-32 rounded-full border-6 border-white shadow-lg object-cover"
            />
            
            {selectedUser && (
              <div className="flex space-x-3 mt-16">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentUser.name}</h1>
            <p className="text-gray-600 mb-4">{currentUser.username}</p>
            <p className="text-gray-700 leading-relaxed">{currentUser.bio}</p>
          </div>
          
          <div className="flex space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentUser.posts}</div>
              <div className="text-gray-600">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentUser.followers.toLocaleString()}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{currentUser.following}</div>
              <div className="text-gray-600">Following</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Posts</h2>
        <div className="grid grid-cols-3 gap-4">
          {userPosts.map((post) => (
            <div key={post.id} className="relative group cursor-pointer">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
