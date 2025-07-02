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
import { usePosts } from '../hooks/usePosts';
import { useMessages } from '../hooks/useMessages';

const Index = () => {
  const [activeView, setActiveView] = useState('feed');
  const [selectedUser, setSelectedUser] = useState(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [profileCheckLoading, setProfileCheckLoading] = useState(true);
  const [messageTargetUser, setMessageTargetUser] = useState(null);
  const { user, loading } = useAuth();
  const { toggleLike } = usePosts();
  const { startNewConversation, setSelectedConversationId } = useMessages();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect non-authenticated users to landing page
      navigate('/landing');
    }
  }, [user, loading, navigate]);

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
        setNeedsProfileSetup(true);
      } else if (!data.username || !data.full_name) {
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

  const handleUserClick = (clickedUser: any) => {
    setSelectedUser(clickedUser);
    setActiveView('profile');
  };

  const handleStartConversation = async (userId: string, targetUser?: any) => {
    if (startNewConversation && setSelectedConversationId) {
      await startNewConversation(userId);
      setSelectedConversationId(userId);
      setMessageTargetUser(targetUser || selectedUser);
      setActiveView('messages');
    }
  };

  if (loading || profileCheckLoading) {
    return (
      <div className="min-h-screen bg-[image:var(--gradient-accent)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-primary-glow/20 border-b-primary-glow rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h2 className="text-3xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-3">
            Veloxa
          </h2>
          <p className="text-muted-foreground font-medium text-lg">جاري تحميل شبكة التواصل الذكية...</p>
          <div className="mt-8 flex justify-center space-x-1 space-x-reverse">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (user && needsProfileSetup) {
    return <ProfileSetup onComplete={handleProfileSetupComplete} />;
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-accent)]">
      <Header 
        onViewChange={setActiveView} 
        activeView={activeView} 
        onUserClick={handleUserClick}
      />
      
      <div className="flex max-w-7xl mx-auto pt-20">
        {user && (
          <Sidebar 
            onViewChange={setActiveView} 
            activeView={activeView}
            onProfileClick={handleUserClick}
            onLike={toggleLike}
            showSuggestions={activeView === 'feed'}
          />
        )}
        
        <main className="flex-1 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {activeView === 'feed' && <Feed onProfileClick={handleUserClick} />}
            {activeView === 'profile' && user && (
              <ProfilePanel 
                selectedUser={selectedUser} 
                onViewChange={setActiveView}
                onStartConversation={handleStartConversation}
              />
            )}
            {activeView === 'messages' && user && (
              <MessagingPanel 
                initialTargetUser={messageTargetUser}
                onClearTarget={() => setMessageTargetUser(null)}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
