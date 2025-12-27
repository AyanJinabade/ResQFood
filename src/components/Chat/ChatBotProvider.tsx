import { createContext, useContext, useState, ReactNode } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: Date;
  metadata?: {
    ticketId?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
  };
}

interface SupportSession {
  id: string;
  userId: string;
  type: 'chat' | 'ticket' | 'emergency';
  status: 'active' | 'waiting' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  messages: ChatMessage[];
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatBotContextType {
  isEnabled: boolean;
  isOpen: boolean;
  unreadCount: number;
  currentSession: SupportSession | null;
  sessions: SupportSession[];
  toggleChatBot: () => void;
  openChatBot: () => void;
  closeChatBot: () => void;
  setUnreadCount: (count: number) => void;
  createSession: (type: 'chat' | 'ticket' | 'emergency', category: string, priority: 'low' | 'medium' | 'high' | 'urgent') => SupportSession;
  endSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  getSessionHistory: (userId: string) => SupportSession[];
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const useChatBot = () => {
  const context = useContext(ChatBotContext);
  if (!context) {
    throw new Error('useChatBot must be used within a ChatBotProvider');
  }
  return context;
};

export const ChatBotProvider = ({ children }: { children: ReactNode }) => {
  const [isEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentSession, setCurrentSession] = useState<SupportSession | null>(null);
  const [sessions, setSessions] = useState<SupportSession[]>([]);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const openChatBot = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const closeChatBot = () => {
    setIsOpen(false);
  };

  const createSession = (
    type: 'chat' | 'ticket' | 'emergency', 
    category: string, 
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ): SupportSession => {
    const newSession: SupportSession = {
      id: `${type.toUpperCase()}-${Date.now()}`,
      userId: 'current-user', // Would be actual user ID
      type,
      status: 'active',
      priority,
      category,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    
    return newSession;
  };

  const endSession = (sessionId: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'resolved', updatedAt: new Date() }
          : session
      )
    );
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  const addMessage = (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: new Date()
            }
          : session
      )
    );

    if (currentSession?.id === sessionId) {
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date()
      } : null);
    }

    // Increment unread count if chat is closed and message is from bot/support
    if (!isOpen && message.sender !== 'user') {
      setUnreadCount(prev => prev + 1);
    }
  };

  const getSessionHistory = (userId: string): SupportSession[] => {
    return sessions.filter(session => session.userId === userId);
  };

  return (
    <ChatBotContext.Provider value={{
      isEnabled,
      isOpen,
      unreadCount,
      currentSession,
      sessions,
      toggleChatBot,
      openChatBot,
      closeChatBot,
      setUnreadCount,
      createSession,
      endSession,
      addMessage,
      getSessionHistory
    }}>
      {children}
    </ChatBotContext.Provider>
  );
};