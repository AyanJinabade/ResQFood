import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DynamicChatBot, ChatContext, ChatResponse } from '../utils/chatBotResponses';
import { FoodDonation as SupabaseFoodDonation } from '../lib/supabase';
import { User, FoodDonation } from '../types/index';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define interface for user stats
interface UserStats {
  totalDonations?: number;
  activeDonations?: number;
  totalServed?: number;
  availableFood?: number;
  pendingRequests?: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: Date;
  metadata?: {
    intent?: string;
    category?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    requiresHuman?: boolean;
  };
}

interface ChatSession {
  id: string;
  userId: string;
  type: 'general' | 'support' | 'emergency';
  status: 'active' | 'resolved' | 'escalated';
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const useDynamicChatBot = () => {
  const { user: supabaseUser } = useAuth();
  const { donations: supabaseDonations } = useApp();
  const [chatBot, setChatBot] = useState<DynamicChatBot | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  // Map Supabase User to the expected User type
  const mapUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      role: ['restaurant', 'society', 'ngo', 'admin'].includes(supabaseUser.role as string)
        ? (supabaseUser.role as 'restaurant' | 'society' | 'ngo' | 'admin')
        : 'restaurant',
      name: supabaseUser.user_metadata?.name || 'Unknown',
      location: {
        lat: supabaseUser.user_metadata?.location?.lat || 0,
        lng: supabaseUser.user_metadata?.location?.lng || 0,
        address: supabaseUser.user_metadata?.location?.address || 'Unknown',
      },
      verified: supabaseUser.user_metadata?.verified || false,
      createdAt: supabaseUser.created_at || new Date().toISOString(),
      phone: supabaseUser.user_metadata?.phone || '',
    };
  };

  // Map Supabase FoodDonation to the expected FoodDonation type
  const mapDonations = (supabaseDonations: SupabaseFoodDonation[]): FoodDonation[] => {
    // Only include donations with a valid status for FoodDonation type
    return supabaseDonations
      .filter((d) =>
        d.status === 'available' ||
        d.status === 'reserved' ||
        d.status === 'collected' ||
        d.status === 'expired'
      )
      .map((d) => ({
        id: d.id,
        created_at: d.created_at,
        createdAt: d.created_at, // Map to camelCase for FoodDonation
        updated_at: d.updated_at,
        donor_id: d.donor_id,
        donor: d.donor,
        reserved_ngo: d.reserved_ngo,
        reservedNgo: d.reserved_ngo,
        food_name: d.food_name,
        foodName: d.food_name,
        food_type: d.food_type,
        foodType: d.food_type,
        quantity: d.quantity,
        unit: d.unit,
        description: d.description,
        image_url: d.image_url,
        freshness_score: d.freshness_score,
        freshnessScore: d.freshness_score,
        expiry_time: d.expiry_time,
        expiryTime: d.expiry_time,
        status: d.status as 'available' | 'reserved' | 'collected' | 'expired',
        pickup_instructions: d.pickup_instructions,
        pickupInstructions: d.pickup_instructions,
        dietary_info: d.dietary_info,
        allergen_info: d.allergen_info,
        userName: d.donor?.name || 'Unknown',
        userId: d.donor_id,
        location: (d.donor && 'location' in d.donor && (d.donor as any).location)
          ? (d.donor as any).location
          : { lat: 0, lng: 0, address: 'Unknown' }, // Fallback location
      }));
  };

  // Initialize chatbot with current context
  useEffect(() => {
    const mappedUser = mapUser(supabaseUser);
    const mappedDonations = mapDonations(supabaseDonations);
    const context: ChatContext = {
      user: mappedUser,
      donations: mappedDonations,
      userStats: getUserStats(mappedUser, mappedDonations),
    };

    const bot = new DynamicChatBot(context);
    setChatBot(bot);
  }, [supabaseUser, supabaseDonations]);

  const getUserStats = (mappedUser: User | null, mappedDonations: FoodDonation[]): UserStats => {
    if (!mappedUser) return {};

    switch (mappedUser.role) {
      case 'restaurant':
      case 'society':
        const myDonations = mappedDonations.filter((d) => d.userId === mappedUser.id);
        return {
          totalDonations: myDonations.length,
          activeDonations: myDonations.filter((d) => d.status === 'available').length,
          totalServed: myDonations.reduce(
            (sum, d) => (d.status === 'collected' ? sum + d.quantity : sum),
            0
          ),
        };

      case 'ngo':
        return {
          availableFood: mappedDonations.filter((d) => d.status === 'available').length,
          pendingRequests: 0, // Would come from actual requests
          totalServed: 0, // Would come from collected requests
        };

      default:
        return {};
    }
  };

  const sendMessage = async (message: string): Promise<ChatResponse> => {
    if (!chatBot) {
      throw new Error('ChatBot not initialized');
    }

    setIsProcessing(true);

    try {
      // Add user message to history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };

      setConversationHistory((prev) => [...prev, userMessage]);

      // Update chatbot context with latest data
      chatBot.updateContext({
        user: mapUser(supabaseUser),
        donations: mapDonations(supabaseDonations),
        userStats: getUserStats(mapUser(supabaseUser), mapDonations(supabaseDonations)),
      });

      // Generate response
      const response = chatBot.generateResponse(message);

      // Add bot response to history
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: response.requiresHuman ? 'support' : 'bot',
        timestamp: new Date(),
        metadata: {
          priority: response.priority,
          requiresHuman: response.requiresHuman,
        },
      };

      setConversationHistory((prev) => [...prev, botMessage]);

      // Create or update session
      if (!currentSession) {
        const newSession: ChatSession = {
          id: `SESSION-${Date.now()}`,
          userId: supabaseUser?.id || 'anonymous',
          type: response.priority === 'urgent' ? 'emergency' : 'general',
          status: 'active',
          messages: [userMessage, botMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setCurrentSession(newSession);
      } else {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, userMessage, botMessage],
                updatedAt: new Date(),
              }
            : null
        );
      }

      return response;
    } finally {
      setIsProcessing(false);
    }
  };

  const escalateToHuman = () => {
    if (currentSession) {
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              status: 'escalated',
              type: 'support',
              updatedAt: new Date(),
            }
          : null
      );
    }

    // Add system message about escalation
    const escalationMessage: ChatMessage = {
      id: Date.now().toString(),
      text: '🔄 **Escalated to Human Support**\n\nYour conversation has been transferred to our support team. A human agent will join shortly to assist you personally.',
      sender: 'bot',
      timestamp: new Date(),
      metadata: {
        priority: 'high',
        requiresHuman: true,
      },
    };

    setConversationHistory((prev) => [...prev, escalationMessage]);
  };

  const endSession = () => {
    if (currentSession) {
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              status: 'resolved',
              updatedAt: new Date(),
            }
          : null
      );
    }
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setCurrentSession(null);
    localStorage.removeItem('resqfood_chat_history');
  };

  const getContextualSuggestions = (): string[] => {
    return chatBot?.getContextualSuggestions() || [];
  };

  // Save conversation history to localStorage
  useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem('resqfood_chat_history', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  // Load conversation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('resqfood_chat_history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory) as ChatMessage[];
        setConversationHistory(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  return {
    sendMessage,
    escalateToHuman,
    endSession,
    clearHistory,
    getContextualSuggestions,
    isProcessing,
    conversationHistory,
    currentSession,
    chatBot,
  };
};