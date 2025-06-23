
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  read: boolean;
  created_at: string;
  sender: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  receiver: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
      subscribeToMessages();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (id, username, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey (id, username, full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();

      data?.forEach((message: any) => {
        const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
        const conversationKey = otherUser.id;

        if (!conversationMap.has(conversationKey)) {
          conversationMap.set(conversationKey, {
            user: otherUser,
            lastMessage: message,
            unreadCount: 0
          });
        }

        // Count unread messages (received messages that are unread)
        if (message.receiver_id === user.id && !message.read) {
          const conv = conversationMap.get(conversationKey)!;
          conv.unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (username, full_name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey (username, full_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setCurrentMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', user.id);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: "تم إرسال الرسالة بنجاح!",
      });

      // Refresh conversations and current messages
      await fetchConversations();
      await fetchMessages(receiverId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    conversations,
    currentMessages,
    loading,
    fetchMessages,
    sendMessage,
    refreshConversations: fetchConversations
  };
};
