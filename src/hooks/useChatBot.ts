import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { DynamicChatBot, ChatContext, ChatResponse } from "../utils/chatBotResponses";
import { FoodDonation as SupabaseFoodDonation } from "../lib/supabase";
import { User, FoodDonation } from "../types";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Types
interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot" | "support";
  timestamp: Date;
  metadata?: {
    priority?: "low" | "medium" | "high" | "urgent";
    requiresHuman?: boolean;
  };
}

interface ChatSession {
  id: string;
  userId: string;
  type: "general" | "support" | "emergency";
  status: "active" | "resolved" | "escalated";
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
// Hook
export const useDynamicChatBot = () => {
  const { user: supabaseUser } = useAuth();
  const { donations: supabaseDonations } = useApp();

  const [chatBot, setChatBot] = useState<DynamicChatBot | null>(null);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  
  // Mapping (Memoized)
  const mappedUser = useMemo<User | null>(() => {
    if (!supabaseUser) return null;

    const role =
      supabaseUser.user_metadata?.role ||
      "restaurant";

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      role,
      name: supabaseUser.user_metadata?.name || "Unknown",
      location: supabaseUser.user_metadata?.location || {
        lat: 0,
        lng: 0,
        address: "Unknown"
      },
      verified: supabaseUser.user_metadata?.verified || false,
      createdAt: supabaseUser.created_at,
      phone: supabaseUser.user_metadata?.phone || ""
    };
  }, [supabaseUser]);

  const mappedDonations = useMemo<FoodDonation[]>(() => {
    return supabaseDonations.map((d: SupabaseFoodDonation) => ({
      id: d.id,
      userId: d.donor_id,
      userName: d.donor?.name || "Unknown",
      quantity: d.quantity,
      status: d.status,
      freshnessScore: d.freshness_score || 0,
      location: d.donor?.location || { lat: 0, lng: 0, address: "Unknown" }
    }));
  }, [supabaseDonations]);

  // Stats
  const userStats = useMemo(() => {
    if (!mappedUser) return {};

    if (mappedUser.role === "restaurant") {
      const my = mappedDonations.filter(d => d.userId === mappedUser.id);

      return {
        totalDonations: my.length,
        activeDonations: my.filter(d => d.status === "available").length,
        totalServed: my.reduce(
          (sum, d) => (d.status === "collected" ? sum + d.quantity : sum),
          0
        )
      };
    }

    if (mappedUser.role === "ngo") {
      return {
        availableFood: mappedDonations.filter(d => d.status === "available").length
      };
    }

    return {};
  }, [mappedUser, mappedDonations]);

  // Init chatbot
  useEffect(() => {
    const context: ChatContext = {
      user: mappedUser,
      donations: mappedDonations,
      userStats
    };

    setChatBot(new DynamicChatBot(context));
  }, [mappedUser, mappedDonations, userStats]);

  // Send Message
  const sendMessage = async (message: string): Promise<ChatResponse> => {
    if (!chatBot) throw new Error("Chatbot not ready");

    setIsProcessing(true);

    try {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        text: message,
        sender: "user",
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, userMsg]);

      chatBot.updateContext({
        user: mappedUser,
        donations: mappedDonations,
        userStats
      });

      const response = chatBot.generateResponse(message);

      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        text: response.text,
        sender: response.requiresHuman ? "support" : "bot",
        timestamp: new Date(),
        metadata: {
          priority: response.priority,
          requiresHuman: response.requiresHuman
        }
      };

      setConversationHistory(prev => [...prev, botMsg]);

      return response;
    } catch (err) {
      console.error("Chat error:", err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Local Storage (FIXED)
  
  useEffect(() => {
    localStorage.setItem(
      "chat_history",
      JSON.stringify(conversationHistory)
    );
  }, [conversationHistory]);

  useEffect(() => {
    const data = localStorage.getItem("chat_history");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const fixed = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setConversationHistory(fixed);
      } catch {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // -----------------------------
  return {
    sendMessage,
    conversationHistory,
    isProcessing,
    chatBot
  };
};
