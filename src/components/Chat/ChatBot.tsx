import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Phone,
  AlertCircle,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: Date;
  type?: 'text' | 'system' | 'notification';
  metadata?: {
    ticketId?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    category?: string;
  };
}

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatBot = () => {
  const { user } = useAuth();
  const { donations } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
  const [, setSupportMode] = useState<'chat' | 'ticket' | 'emergency'>('chat');
  const [isConnectedToSupport, setIsConnectedToSupport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, user]);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Hello${user ? ` ${user.email}` : ''}! 👋 

I'm your ResQFood support assistant. I can help you with:

🍽️ **Food Donations** - Adding, managing, and optimizing your listings
🔍 **Finding Food** - Locating available donations in your area  
📱 **Platform Help** - Navigation, features, and troubleshooting
🚨 **Urgent Issues** - Emergency food needs or technical problems
💬 **Live Support** - Connect with our human support team

How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  };

  const analyzeUserIntent = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Emergency keywords
    const emergencyKeywords = ['urgent', 'emergency', 'help', 'problem', 'issue', 'broken', 'error', 'bug'];
    const isEmergency = emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // Category detection
    let category = 'general';
    if (lowerMessage.includes('food') || lowerMessage.includes('donation')) category = 'food-management';
    if (lowerMessage.includes('account') || lowerMessage.includes('profile')) category = 'account';
    if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) category = 'billing';
    if (lowerMessage.includes('technical') || lowerMessage.includes('bug')) category = 'technical';
    if (lowerMessage.includes('ngo') || lowerMessage.includes('request')) category = 'ngo-support';
    
    // Priority detection
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    if (isEmergency) priority = 'urgent';
    if (lowerMessage.includes('asap') || lowerMessage.includes('immediately')) priority = 'high';
    if (lowerMessage.includes('when possible') || lowerMessage.includes('no rush')) priority = 'low';
    
    return { category, priority, isEmergency };
  };

  const generateContextualResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const { category, priority, isEmergency } = analyzeUserIntent(userMessage);

    // Emergency response
    if (isEmergency) {
      return `🚨 **Emergency Support Activated**

I understand this is urgent. Here's immediate help:

📞 **Emergency Hotline**: +1-800-RESQFOOD (24/7)
📧 **Priority Email**: emergency@resqfood.com
💬 **Live Chat**: I'm connecting you to our support team now...

**Common Emergency Solutions:**
• Food safety concerns → Contact health department
• Technical issues → Try refreshing or clearing browser cache
• Urgent food needs → Check "Available Food" for immediate options
• Account problems → Use "Forgot Password" or contact us directly

Would you like me to connect you with a human support agent right now?`;
    }

    // Context-aware responses based on user role and current data
    if (user) {
      const userStats = getUserStats();
      
      if (lowerMessage.includes('donation') && (user.role === 'restaurant' || user.role === 'society')) {
        return `I can help you with food donations! 🍽️

**Your Current Status:**
• Active donations: ${userStats.activeDonations}
• Total donations: ${userStats.totalDonations}
• People served: ${userStats.totalServed}

**Common Donation Questions:**
• "How do I add food?" → Go to Dashboard → Add Food
• "Why isn't my food being requested?" → Check expiry time and freshness score
• "How do I improve my freshness score?" → Post food sooner, better descriptions
• "Can I edit my donation?" → Yes, while it's still available

**Specific Help Needed?**
Please tell me exactly what you'd like to do with your donations, and I'll provide step-by-step guidance!`;
      }

      if (lowerMessage.includes('food') && user.role === 'ngo') {
        return `I can help you find and request food! 🔍

**Available Near You:**
• ${userStats.availableFood} food items currently available
• ${userStats.pendingRequests} of your requests are pending
• ${userStats.totalServed} people you've helped feed

**Finding Food Tips:**
• Check "Available Food" section regularly
• Filter by location and food type
• Look for high freshness scores (90%+)
• Act quickly on urgent items

**Request Process:**
1. Browse available food
2. Click "Request Food" on items you can collect
3. Wait for donor approval
4. Coordinate pickup time
5. Collect and distribute food

What specific help do you need with finding or requesting food?`;
      }
    }

    // General contextual responses
    if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
      return `Here's how ResQFood works! 🌟

**The Process:**
1. **Donors** (restaurants, societies) post surplus food
2. **NGOs** browse and request available food
3. **Coordination** happens through our platform
4. **Collection** is arranged between donor and NGO
5. **Impact** is tracked and reported

**Key Features:**
• Real-time food availability
• AI-powered freshness scoring
• Location-based matching
• Secure communication
• Impact tracking

**Getting Started:**
• New to the platform? I can guide you through registration
• Already registered? I can help you navigate features
• Having issues? I can troubleshoot problems

What specific aspect would you like me to explain in detail?`;
    }

    if (lowerMessage.includes('account') || lowerMessage.includes('profile')) {
      return `I can help with account management! 👤

**Account Features:**
• Profile settings and information
• Password and security settings
• Notification preferences
• Location and contact details

**Common Account Tasks:**
• Update profile information
• Change password
• Verify account status
• Manage notifications
• Update location/address

**Account Issues:**
• Can't log in? Try password reset
• Email not verified? Check spam folder
• Profile incomplete? Update in Settings
• Location wrong? Update in Profile

What specific account help do you need? I can provide detailed steps for any account-related task.`;
    }

    // Dynamic response based on current context
    return `I'm here to help with your ResQFood question! 🤖

**Based on your message about "${userMessage}"**, here's what I can assist with:

**Immediate Help:**
• Step-by-step guidance for any platform feature
• Troubleshooting technical issues
• Explaining how specific features work
• Connecting you with human support if needed

**Your Context:**
${user ? `• Logged in as: ${user.email} (${user.role})` : '• Not logged in - I can help with registration'}
${user && category === 'food-management' ? `• You have access to food management features` : ''}
${priority === 'urgent' ? `• I've marked this as high priority` : ''}

**Next Steps:**
Please provide more specific details about what you'd like to do or what problem you're experiencing. The more specific you are, the better I can help!

**Need Human Support?**
If you'd prefer to speak with a human agent, I can connect you right away.`;
  };

  const getUserStats = () => {
    if (!user) return {};

    switch (user.role) {
      case 'restaurant':
      case 'society':
        const myDonations = donations.filter(d => d.userId === user.id);
        return {
          totalDonations: myDonations.length,
          activeDonations: myDonations.filter(d => d.status === 'available').length,
          totalServed: myDonations.reduce((sum, d) => d.status === 'collected' ? sum + d.quantity : sum, 0)
        };
      
      case 'ngo':
        const availableFood = donations.filter(d => d.status === 'available').length;
        return {
          availableFood,
          pendingRequests: 0, // Would come from requests context
          totalServed: 0 // Would come from collected requests
        };
      
      default:
        return {};
    }
  };

  const createSupportTicket = (message: string) => {
    const { category, priority } = analyzeUserIntent(message);
    
    const ticket: SupportTicket = {
      id: `TICKET-${Date.now()}`,
      userId: user?.id || 'anonymous',
      subject: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      status: 'open',
      priority,
      category,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentTicket(ticket);
    setSupportMode('ticket');
    
    return ticket;
  };

  const connectToLiveSupport = () => {
    setIsConnectedToSupport(true);
    const supportMessage: Message = {
      id: Date.now().toString(),
      text: `🔗 **Connected to Live Support**

You're now connected to our human support team. A support agent will respond shortly.

**Your Session Info:**
• Ticket ID: ${currentTicket?.id || 'LIVE-' + Date.now()}
• Priority: ${currentTicket?.priority || 'medium'}
• User: ${user?.email || 'Guest'} (${user?.role || 'visitor'})

**Average Response Time:** 2-5 minutes during business hours

Please describe your issue in detail, and our team will assist you promptly.`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'system'
    };
    
    setMessages(prev => [...prev, supportMessage]);
    
    // Simulate human agent joining
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Hello! I'm Sarah from the ResQFood support team. I see you need help with "${currentTicket?.subject || 'your inquiry'}". 

I'm here to assist you personally. Could you please provide more details about the issue you're experiencing?`,
        sender: 'support',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 3000 + Math.random() * 2000);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Check if user wants live support
    if (text.toLowerCase().includes('human') || text.toLowerCase().includes('agent') || text.toLowerCase().includes('live support')) {
      setTimeout(() => {
        setIsTyping(false);
        connectToLiveSupport();
      }, 1000);
      return;
    }

    // Check if this should create a support ticket
    const { priority, isEmergency } = analyzeUserIntent(text);
    if (priority === 'urgent' || isEmergency) {
      if (!currentTicket) {
        createSupportTicket(text);
      }
    }

    // Generate dynamic response
    setTimeout(() => {
      const botResponse = generateContextualResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: isConnectedToSupport ? 'support' : 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'live_support':
        connectToLiveSupport();
        break;
      case 'create_ticket':
        const ticket = createSupportTicket('General support request');
        handleSendMessage(`I need help with my ResQFood account. Ticket ID: ${ticket.id}`);
        break;
      case 'emergency':
        setSupportMode('emergency');
        handleSendMessage('This is an emergency situation that needs immediate attention');
        break;
      case 'faq':
        handleSendMessage('I have a general question about how ResQFood works');
        break;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-110 z-50 group"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need Help? Chat with us!
        </div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between ${
        isMinimized ? 'rounded-b-2xl' : ''
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            {isConnectedToSupport ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold">
              {isConnectedToSupport ? 'Live Support' : 'ResQFood Support'}
            </h3>
            <p className="text-xs text-green-100">
              {isConnectedToSupport ? 'Connected to agent' : 'AI Assistant + Live Support'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {currentTicket && (
            <div className={`px-2 py-1 rounded text-xs ${getPriorityColor(currentTicket.priority)}`}>
              {currentTicket.priority.toUpperCase()}
            </div>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Support Options */}
          {messages.length === 1 && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAction('live_support')}
                  className="flex items-center space-x-2 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Live Support</span>
                </button>
                <button
                  onClick={() => handleQuickAction('emergency')}
                  className="flex items-center space-x-2 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Emergency</span>
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 h-96 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : message.sender === 'support'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-1 text-green-600" />
                    )}
                    {message.sender === 'support' && (
                      <User className="w-4 h-4 mt-1 text-white" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.sender === 'user' ? 'text-green-100' : 
                          message.sender === 'support' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.sender === 'support' && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-blue-100">Online</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    {isConnectedToSupport ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-green-600" />}
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {isConnectedToSupport ? 'Agent typing...' : 'Analyzing...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Support Status */}
          {(currentTicket || isConnectedToSupport) && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {isConnectedToSupport ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-700">Live support active</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">Ticket: {currentTicket?.id}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleQuickAction('live_support')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isConnectedToSupport ? 'End Session' : 'Get Live Help'}
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={isConnectedToSupport ? "Message support agent..." : "Ask anything about ResQFood..."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-full hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Actions */}
            {!isConnectedToSupport && messages.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => handleQuickAction('live_support')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Talk to Human
                </button>
                <button
                  onClick={() => handleSendMessage('I need step-by-step help')}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
                >
                  Step-by-step Help
                </button>
                <button
                  onClick={() => handleSendMessage('I have a technical problem')}
                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 transition-colors"
                >
                  Technical Issue
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;