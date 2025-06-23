
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Feed } from '../components/Feed';
import { ProfilePanel } from '../components/ProfilePanel';
import { MessagingPanel } from '../components/MessagingPanel';

const Index = () => {
  const [activeView, setActiveView] = useState('feed');
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onViewChange={setActiveView} activeView={activeView} />
      
      <div className="flex max-w-7xl mx-auto pt-16">
        <Sidebar onViewChange={setActiveView} activeView={activeView} />
        
        <main className="flex-1 px-4 py-6">
          {activeView === 'feed' && <Feed onProfileClick={setSelectedUser} />}
          {activeView === 'profile' && <ProfilePanel selectedUser={selectedUser} />}
          {activeView === 'messages' && <MessagingPanel />}
        </main>
      </div>
    </div>
  );
};

export default Index;
