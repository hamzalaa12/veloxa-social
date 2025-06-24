import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, User, Phone, Video, Send, Smile, Paperclip, MoreVertical, Plus, Search, ArrowRight, X } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface MessagingPanelProps {
  initialTargetUser?: any;
  onClearTarget?: () => void;
}

export const MessagingPanel: React.FC<MessagingPanelProps> = ({ 
  initialTargetUser, 
  onClearTarget 
}) => {
  const { user } = useAuth();
  const { 
    conversations, 
    currentMessages, 
    loading, 
    selectedConversationId,
    fetchMessages, 
    sendMessage,
    setSelectedConversationId 
  } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const selectedUser = conversations.find(conv => conv.user.id === selectedConversationId)?.user || initialTargetUser;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    if (initialTargetUser && !loading) {
      setSelectedConversationId(initialTargetUser.id);
      fetchMessages(initialTargetUser.id);
      setShowNewConversation(true);
    }
  }, [initialTargetUser, loading]);

  const handleSelectConversation = async (userId: string) => {
    setSelectedConversationId(userId);
    await fetchMessages(userId);
    setShowNewConversation(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || sendingMessage) return;

    setSendingMessage(true);
    try {
      await sendMessage(selectedConversationId, newMessage);
      setNewMessage('');
      setShowNewConversation(false);
      if (onClearTarget) onClearTarget();
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

  const handleCloseNewConversation = () => {
    setShowNewConversation(false);
    setSelectedConversationId(null);
    if (onClearTarget) onClearTarget();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">يرجى تسجيل الدخول للوصول إلى الرسائل</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden h-[750px] flex border border-gradient-to-r from-purple-200/30 to-blue-200/30">
        {/* قائمة المحادثات */}
        <div className="w-1/3 border-r border-gradient-to-b from-purple-100/50 to-blue-100/30">
          <div className="p-6 border-b border-gradient-to-r from-purple-100/50 to-blue-100/30 bg-gradient-to-r from-purple-50/50 to-blue-50/30">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center mb-4">
              <MessageSquare className="w-7 h-7 mr-3 text-purple-600" />
              الرسائل
            </h2>
            
            {/* شريط البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث في المحادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 rounded-2xl border-2 border-gray-200/50 focus:border-purple-300 bg-white/80 backdrop-blur-sm text-right"
              />
            </div>
          </div>
          
          <ScrollArea className="h-full">
            {/* New conversation indicator */}
            {showNewConversation && initialTargetUser && (
              <div className="p-2">
                <div className="p-4 m-2 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-300/60 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full font-bold">
                      محادثة جديدة
                    </span>
                    <Button
                      onClick={handleCloseNewConversation}
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Avatar className="w-12 h-12 ring-2 ring-purple-200/50">
                      <AvatarImage src={initialTargetUser.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-bold">
                        {initialTargetUser.full_name?.charAt(0) || '؟'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {initialTargetUser.full_name || initialTargetUser.username}
                      </h3>
                      <p className="text-sm text-purple-600 font-medium">ابدأ محادثة جديدة</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
              </div>
            )}

            {filteredConversations.length === 0 && !showNewConversation ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-lg font-medium">لا توجد محادثات بعد</p>
                <p className="text-sm mt-2 text-gray-400">ابدأ محادثة جديدة من الملفات الشخصية</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.user.id}
                    onClick={() => handleSelectConversation(conversation.user.id)}
                    className={`p-4 m-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedConversationId === conversation.user.id && !showNewConversation
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-300/60 shadow-xl scale-[1.02] transform'
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 hover:scale-[1.01] transform'
                    }`}
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="relative">
                        <Avatar className="w-16 h-16 ring-2 ring-purple-200/50">
                          <AvatarImage src={conversation.user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-400 text-white font-bold text-lg">
                            {conversation.user.full_name?.charAt(0) || '؟'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 truncate text-lg">
                            {conversation.user.full_name || conversation.user.username}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {new Date(conversation.lastMessage.created_at).toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate max-w-[200px] leading-relaxed">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full px-3 py-1 min-w-[28px] text-center font-bold shadow-lg animate-pulse">
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
                        {selectedUser.full_name?.charAt(0) || '？'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {selectedUser.full_name || selectedUser.username}
                      </h3>
                      <p className="text-sm text-green-600 font-medium">
                        {showNewConversation ? 'محادثة جديدة' : 'متصل الآن'}
                      </p>
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
                  {showNewConversation && currentMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-2">محادثة جديدة</h3>
                      <p className="text-gray-500 mb-4">ابدأ محادثتك الأولى مع {selectedUser.full_name || selectedUser.username}</p>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-2xl border border-purple-200/30 max-w-md mx-auto">
                        <p className="text-sm text-gray-600">
                          💬 اكتب رسالتك الأولى أدناه لبدء المحادثة
                        </p>
                      </div>
                    </div>
                  ) : (
                    currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-end space-x-2 rtl:space-x-reverse max-w-[70%]">
                          {message.sender_id !== user.id && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.sender.avatar_url} />
                              <AvatarFallback className="bg-gray-300 text-xs">
                                {message.sender.full_name?.charAt(0) || '？'}
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
                    ))
                  )}
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
                      placeholder={showNewConversation ? `اكتب رسالة إلى ${selectedUser.full_name || selectedUser.username}...` : "اكتب رسالتك هنا..."}
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
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">اختر محادثة لبدء المراسلة</h3>
                <p className="text-gray-500 mb-6">اختر محادثة من القائمة الجانبية لعرض الرسائل</p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-200/30">
                  <p className="text-sm text-gray-600">
                    💡 لبدء محادثة جديدة، اذهب إلى الملف الشخصي للمستخدم واضغط على "إرسال رسالة"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
