
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Feed } from '../components/Feed';
import { ProfilePanel } from '../components/ProfilePanel';
import { MessagingPanel } from '../components/MessagingPanel';
import { ProfileSetup } from '../components/ProfileSetup';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [activeView, setActiveView] = useState('feed');
  const [selectedUser, setSelectedUser] = useState(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && activeView !== 'feed') {
      navigate('/auth');
    }
  }, [user, loading, activeView, navigate]);

  useEffect(() => {
    if (user) {
      checkProfileSetup();
    } else {
      setProfileCheckLoading(false);
    }
  }, [user]);

  const checkProfileSetup = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking profile setup:', error);
        // If profile doesn't exist, user needs to set it up
        setNeedsProfileSetup(true);
      } else if (!data.username || !data.full_name) {
        // Check if profile needs setup (missing username or full_name)
        setNeedsProfileSetup(true);
      }
    } catch (error) {
      console.error('Error checking profile setup:', error);
      setNeedsProfileSetup(true);
    } finally {
      setProfileCheckLoading(false);
    }
  };

  const handleProfileSetupComplete = () => {
    setNeedsProfileSetup(false);
  };

  if (loading || profileCheckLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show profile setup if user needs to complete their profile
  if (user && needsProfileSetup) {
    return <ProfileSetup onComplete={handleProfileSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onViewChange={setActiveView} activeView={activeView} />
      
      <div className="flex max-w-7xl mx-auto pt-16">
        {user && <Sidebar onViewChange={setActiveView} activeView={activeView} />}
        
        <main className="flex-1 px-4 py-6">
          {activeView === 'feed' && <Feed onProfileClick={setSelectedUser} />}
          {activeView === 'profile' && user && <ProfilePanel selectedUser={selectedUser} />}
          {activeView === 'messages' && user && <MessagingPanel />}
        </main>
      </div>
    </div>
  );
};

export default Index;
