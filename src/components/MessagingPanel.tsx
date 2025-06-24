
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, User, Phone, Video, Send, Smile, Paperclip, MoreVertical } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export const MessagingPanel: React.FC = () => {
  const { user } = useAuth();
  const { conversations, currentMessages, loading, fetchMessages, sendMessage } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedUser = conversations.find(conv => conv.user.id === selectedConversation)?.user;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSelectConversation = async (userId: string) => {
    setSelectedConversation(userId);
    await fetchMessages(userId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    setSendingMessage(true);
    try {
      await sendMessage(selectedConversation, newMessage);
      setNewMessage('');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleVoiceCall = () => {
    toast({
      title: "مكالمة صوتية",
      description: "ميزة المكالمات الصوتية قيد التطوير...",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "مكالمة فيديو",
      description: "ميزة مكالمات الفيديو قيد التطوير...",
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">يرجى تسجيل الدخول للوصول إلى الرسائل</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden h-[700px] flex border border-gradient-to-r from-purple-200/30 to-blue-200/30">
        {/* قائمة المحادثات */}
        <div className="w-1/3 border-r border-gradient-to-b from-purple-100/50 to-blue-100/30">
          <div className="p-6 border-b border-gradient-to-r from-purple-100/50 to-blue-100/30 bg-gradient-to-r from-purple-50/50 to-blue-50/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center">
              <MessageSquare className="w-7 h-7 mr-3 text-purple-600" />
              الرسائل
            </h2>
          </div>
          
          <ScrollArea className="h-full">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>لا توجد محادثات بعد</p>
                <p className="text-sm mt-1">ابدأ محادثة جديدة مع أصدقائك</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.user.id}
                    onClick={() => handleSelectConversation(conversation.user.id)}
                    className={`p-4 m-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedConversation === conversation.user.id
                        ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-300/50 shadow-lg scale-[1.02]'
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="relative">
                        <Avatar className="w-14 h-14 ring-2 ring-purple-200/50">
                          <AvatarImage src={conversation.user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-semibold">
                            {conversation.user.full_name?.charAt(0) || '؟'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-lg">
                            {conversation.user.full_name || conversation.user.username}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.lastMessage.created_at).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate max-w-[200px]">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full px-3 py-1 min-w-[24px] text-center font-semibold shadow-lg">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* منطقة المحادثة */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* رأس المحادثة */}
              <div className="p-6 border-b border-gradient-to-r from-purple-100/50 to-blue-100/30 bg-gradient-to-r from-purple-50/30 to-blue-50/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Avatar className="w-12 h-12 ring-2 ring-purple-200/50">
                      <AvatarImage src={selectedUser.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-semibold">
                        {selectedUser.full_name?.charAt(0) || '؟'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {selectedUser.full_name || selectedUser.username}
                      </h3>
                      <p className="text-sm text-green-600 font-medium">متصل الآن</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      onClick={handleVoiceCall}
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-3 hover:bg-green-100 hover:text-green-600 transition-all duration-200 hover:scale-110"
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={handleVideoCall}
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-3 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                    >
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full p-3 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* الرسائل */}
              <ScrollArea className="flex-1 p-6 bg-gradient-to-br from-gray-50/30 to-blue-50/20">
                <div className="space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end space-x-2 rtl:space-x-reverse max-w-[70%]">
                        {message.sender_id !== user.id && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.sender.avatar_url} />
                            <AvatarFallback className="bg-gray-300 text-xs">
                              {message.sender.full_name?.charAt(0) || '؟'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-lg ${
                            message.sender_id === user.id
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md'
                              : 'bg-white text-gray-900 border border-gray-200/50 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender_id === user.id ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* حقل إدخال الرسالة */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-gradient-to-r from-purple-100/50 to-blue-100/30 bg-white/50">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-3 hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                  >
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="اكتب رسالتك هنا..."
                      className="pr-12 rounded-full border-2 border-gray-200/50 focus:border-purple-300 bg-white/80 backdrop-blur-sm text-right"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
                    >
                      <Smile className="w-4 h-4 text-gray-500" />
                    </Button>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sendingMessage}
                    className="rounded-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {sendingMessage ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50/30 to-blue-50/20">
              <div className="text-center">
                <div className="relative mb-6">
                  <MessageSquare className="w-20 h-20 mx-auto text-gray-300" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">اختر محادثة لبدء المراسلة</h3>
                <p className="text-gray-500">اختر محادثة من القائمة الجانبية لعرض الرسائل</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
