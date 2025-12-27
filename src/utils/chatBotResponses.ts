import { User, FoodDonation } from '../types';

export interface ChatContext {
  user: User | null;
  donations: FoodDonation[];
  currentPage?: string;
  userStats?: {
    totalDonations?: number;
    activeDonations?: number;
    totalServed?: number;
    availableFood?: number;
    pendingRequests?: number;
  };
}

export interface ChatResponse {
  text: string;
  suggestions?: string[];
  actions?: Array<{
    type: 'navigate' | 'action' | 'external';
    label: string;
    value: string;
  }>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  requiresHuman?: boolean;
}

export class DynamicChatBot {
  private context: ChatContext;

  constructor(context: ChatContext) {
    this.context = context;
  }

  public generateResponse(userMessage: string): ChatResponse {
    const message = userMessage.toLowerCase().trim();
    
    // Analyze message intent and context
    const intent = this.analyzeIntent(message);
    const urgency = this.detectUrgency(message);
    const category = this.categorizeMessage(message);

    // Generate contextual response
    return this.buildResponse(message, intent, urgency, category);
  }

  private analyzeIntent(message: string): string {
    const intents = {
      'help_add_food': ['add food', 'create donation', 'post food', 'donate food'],
      'help_find_food': ['find food', 'available food', 'search food', 'locate food'],
      'help_account': ['account', 'profile', 'settings', 'password', 'login'],
      'help_requests': ['request', 'ngo request', 'food request', 'pickup'],
      'help_technical': ['bug', 'error', 'not working', 'broken', 'issue', 'problem'],
      'help_navigation': ['how to', 'where is', 'navigate', 'find page'],
      'emergency': ['urgent', 'emergency', 'immediate', 'asap', 'critical'],
      'feedback': ['feedback', 'suggestion', 'improve', 'feature request'],
      'general_info': ['how does', 'what is', 'explain', 'tell me about']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  private detectUrgency(message: string): 'low' | 'medium' | 'high' | 'urgent' {
    const urgentKeywords = ['urgent', 'emergency', 'immediate', 'asap', 'critical', 'help'];
    const highKeywords = ['soon', 'quickly', 'fast', 'important'];
    const lowKeywords = ['when possible', 'no rush', 'eventually', 'sometime'];

    if (urgentKeywords.some(keyword => message.includes(keyword))) return 'urgent';
    if (highKeywords.some(keyword => message.includes(keyword))) return 'high';
    if (lowKeywords.some(keyword => message.includes(keyword))) return 'low';
    
    return 'medium';
  }

  private categorizeMessage(message: string): string {
    const categories = {
      'food_management': ['food', 'donation', 'add', 'create', 'post', 'upload'],
      'ngo_operations': ['ngo', 'request', 'pickup', 'collect', 'find'],
      'account_management': ['account', 'profile', 'password', 'settings', 'verify'],
      'technical_support': ['bug', 'error', 'broken', 'not working', 'issue'],
      'platform_navigation': ['how to', 'where', 'navigate', 'find'],
      'billing_payment': ['payment', 'billing', 'subscription', 'cost'],
      'general_inquiry': ['what', 'how', 'why', 'explain']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return category;
      }
    }

    return 'general_inquiry';
  }

  private buildResponse(message: string, intent: string, urgency: string, category: string): ChatResponse {
    // Emergency handling
    if (urgency === 'urgent' || intent === 'emergency') {
      return this.buildEmergencyResponse(message);
    }

    // Role-specific responses
    if (this.context.user) {
      switch (this.context.user.role) {
        case 'restaurant':
        case 'society':
          return this.buildDonorResponse(message, intent, category);
        case 'ngo':
          return this.buildNGOResponse(message, intent, category);
        case 'admin':
          return this.buildAdminResponse(message, intent, category);
      }
    }

    // General user response
    return this.buildGeneralResponse(message, intent, category);
  }

// Removed duplicate buildEmergencyResponse implementation

  private buildDonorResponse(message: string, intent: string, _category: string): ChatResponse {
    const stats = this.context.userStats;
    
    switch (intent) {
      case 'help_add_food':
        return {
          text: `I'll help you add food donations! 🍽️

**Your Current Status:**
• Active donations: ${stats?.activeDonations || 0}
• Total donations: ${stats?.totalDonations || 0}
• People served: ${stats?.totalServed || 0}

**Step-by-Step Guide:**
1. **Go to Dashboard** → Click "Add Food" button
2. **Select Food Category** → Choose from meals, bakery, fruits, etc.
3. **Enter Details** → Food name, quantity, description
4. **Set Expiry Time** → Be realistic about freshness
5. **Add Photo** → Optional but increases requests by 60%
6. **Submit** → Your food will be visible to NGOs immediately

**Pro Tips for Better Results:**
• Post food as soon as you know it's surplus
• Use detailed descriptions including ingredients
• Set realistic pickup windows
• Respond quickly to NGO requests

Need help with any specific step? Just ask!`,
          suggestions: [
            'How to improve freshness score?',
            'Best times to post food',
            'Photo upload tips',
            'Managing NGO requests'
          ],
          actions: [
            { type: 'navigate', label: 'Add Food Now', value: '/add-food' },
            { type: 'navigate', label: 'View My Donations', value: '/my-donations' }
          ]
        };

      case 'help_requests':
        return {
          text: `Managing NGO requests effectively! 🤝

**Current Request Status:**
• You have requests waiting for your response
• Average response time affects your rating
• Quick responses lead to more successful donations

**Best Practices:**
• **Respond within 2 hours** for best results
• **Communicate pickup windows** clearly
• **Confirm NGO credentials** before approval
• **Provide clear pickup instructions**
• **Be flexible with timing** when possible

**When to Approve Requests:**
✅ NGO has good rating and history
✅ They can pickup within your timeframe
✅ Clear communication and professionalism
✅ Proper food handling capabilities

**When to Decline:**
❌ Cannot pickup within food safety window
❌ Poor communication or unprofessional
❌ No proper food transport equipment
❌ Suspicious or unverified account

Would you like specific guidance on any current requests?`,
          suggestions: [
            'How to verify NGO credentials?',
            'Setting pickup requirements',
            'Communication templates',
            'Rating system explanation'
          ]
        };

      default:
        return this.buildContextualDonorResponse(message);
    }
  }

  private buildNGOResponse(message: string, intent: string, _category: string): ChatResponse {
    const stats = this.context.userStats;

    switch (intent) {
      case 'help_find_food':
        return {
          text: `Finding available food near you! 🔍

**Current Availability:**
• ${stats?.availableFood || 0} food items available in your area
• ${stats?.pendingRequests || 0} of your requests are pending
• Best pickup times: Early morning and evening

**Smart Search Tips:**
1. **Filter by Location** → Start with closest options
2. **Check Expiry Times** → Prioritize urgent items
3. **Look at Freshness Scores** → 90%+ are highest quality
4. **Read Descriptions** → Check for allergens and details
5. **Act Quickly** → Popular items go fast

**Request Strategy:**
• Request multiple items to increase success rate
• Be flexible with pickup times
• Communicate your capacity clearly
• Build relationships with regular donors

**Current Opportunities:**
• High-priority items expiring soon
• Regular donors in your area
• Bulk donations perfect for large distributions

What type of food are you looking for specifically?`,
          suggestions: [
            'Show urgent food items',
            'Find regular donors nearby',
            'Bulk donation opportunities',
            'Filter by food type'
          ],
          actions: [
            { type: 'navigate', label: 'Browse Available Food', value: '/available-food' },
            { type: 'navigate', label: 'My Requests', value: '/my-requests' }
          ]
        };

      case 'help_requests':
        return {
          text: `Managing your food requests! 📋

**Request Status Overview:**
• Pending: Waiting for donor approval
• Accepted: Approved, coordinate pickup
• Collected: Successfully picked up
• Declined: Not approved by donor

**Improving Approval Rates:**
• **Complete your profile** with verification
• **Respond quickly** to donor messages
• **Be flexible** with pickup times
• **Maintain good ratings** through feedback
• **Communicate clearly** about your needs

**Pickup Best Practices:**
• Confirm pickup time 2 hours before
• Bring proper containers and cooling equipment
• Arrive on time with ID and credentials
• Inspect food quality upon pickup
• Thank the donor and leave positive feedback

**If Requests Are Being Declined:**
• Check if your profile is complete and verified
• Review your pickup history and ratings
• Ensure you're requesting appropriate quantities
• Improve communication in request messages

Need help with any specific requests?`,
          suggestions: [
            'Why was my request declined?',
            'How to improve approval rate?',
            'Pickup coordination help',
            'Profile verification status'
          ]
        };

      default:
        return this.buildContextualNGOResponse(message);
    }
  }

  private buildAdminResponse(_message: string, _intent: string, _category: string): ChatResponse {
    return {
      text: `Admin Support Available! 🛠️

**System Overview:**
• Platform health monitoring
• User management tools
• Analytics and reporting
• Content moderation

**Common Admin Tasks:**
• User verification and management
• Donation monitoring and moderation
• System analytics and reporting
• Platform configuration
• Support ticket management

**Available Tools:**
• User dashboard with detailed analytics
• Donation tracking and quality control
• Automated alert systems
• Bulk communication tools
• System health monitoring

**Need Specific Help With:**
• User management procedures?
• Analytics interpretation?
• System configuration?
• Emergency response protocols?

What administrative task can I help you with?`,
      suggestions: [
        'User verification process',
        'System analytics help',
        'Emergency procedures',
        'Platform configuration'
      ],
      actions: [
        { type: 'navigate', label: 'Admin Dashboard', value: '/admin' },
        { type: 'navigate', label: 'User Management', value: '/admin/users' },
        { type: 'navigate', label: 'System Analytics', value: '/admin/analytics' }
      ]
    };
  }

  private buildGeneralResponse(message: string, _intent: string, _category: string): ChatResponse {
    return {
      text: `I'm here to help with ResQFood! 🤖

**Based on your message:** "${message}"

I can provide specific guidance on:

🍽️ **Food Donations** - How to add, manage, and optimize your food listings
🔍 **Finding Food** - Locating available donations and making requests  
👤 **Account Help** - Profile setup, verification, and settings
🛠️ **Technical Support** - Troubleshooting and bug reports
📱 **Platform Navigation** - Finding features and using tools
💬 **Live Support** - Connect with human agents for complex issues

**To give you the most helpful response, could you tell me:**
• What specific task are you trying to accomplish?
• Are you experiencing any error messages?
• What page or feature are you having trouble with?

**Quick Options:**
• Type "live support" to connect with a human agent
• Type "step by step" for detailed guidance
• Type "emergency" for urgent issues

The more specific you are, the better I can help! What would you like to know?`,
      suggestions: [
        'How does ResQFood work?',
        'I need step-by-step help',
        'Connect me to live support',
        'I have a technical problem'
      ],
      actions: [
        { type: 'action', label: 'Live Support', value: 'connect_agent' },
        { type: 'navigate', label: 'Help Center', value: '/help' },
        { type: 'action', label: 'Create Ticket', value: 'create_ticket' }
      ]
    };
  }

  private buildContextualDonorResponse(message: string): ChatResponse {
    const stats = this.context.userStats;
    
    return {
      text: `I can help you with that! 🍽️

**Your Current Activity:**
• Active donations: ${stats?.activeDonations || 0}
• Total donations: ${stats?.totalDonations || 0}
• People served: ${stats?.totalServed || 0}

**Based on your question about "${message}", here are some relevant tips:**

**Optimizing Your Donations:**
• Post food immediately when you know it's surplus
• Use clear, appetizing photos
• Write detailed descriptions including ingredients
• Set realistic expiry times
• Respond quickly to NGO requests

**Common Challenges & Solutions:**
• Low request rates → Improve photos and descriptions
• Food expiring before pickup → Set shorter expiry windows
• NGO no-shows → Require confirmation calls
• Quality concerns → Better packaging and storage

**Want Specific Help?**
Tell me exactly what you're trying to do or what problem you're facing, and I'll provide detailed, step-by-step guidance tailored to your situation.

You can also connect with our live support team for personalized assistance!`,
      suggestions: [
        'How to get more requests for my food?',
        'Best practices for food photography',
        'Managing pickup schedules',
        'Connect with live support'
      ]
    };
  }

  private buildContextualNGOResponse(message: string): ChatResponse {
    const stats = this.context.userStats;
    
    return {
      text: `I'm here to help you find and collect food! 🔍

**Your Current Status:**
• Available food nearby: ${stats?.availableFood || 0} items
• Pending requests: ${stats?.pendingRequests || 0}
• Total people served: ${stats?.totalServed || 0}

**Regarding your question about "${message}":**

**Finding Food Efficiently:**
• Check the platform multiple times daily
• Set up notifications for your preferred food types
• Build relationships with regular donors
• Be flexible with pickup times

**Improving Request Success:**
• Complete your profile with verification
• Respond to donor messages quickly
• Be realistic about pickup capacity
• Maintain good ratings through feedback

**Pickup Excellence:**
• Confirm pickup details 2 hours before
• Bring proper containers and cooling equipment
• Arrive on time with credentials
• Thank donors and leave feedback

**Need Specific Guidance?**
I can provide detailed help with any aspect of finding, requesting, or collecting food. What specific challenge are you facing?

For complex coordination issues, our live support team can help with real-time problem solving!`,
      suggestions: [
        'How to find food in my area?',
        'Why are my requests being declined?',
        'Pickup coordination help',
        'Talk to live support'
      ]
    };
  }

  private buildEmergencyResponse(_message: string): ChatResponse {
    return {
      text: `🚨 **Emergency Support Protocol Activated**

**Immediate Emergency Contacts:**
📞 **24/7 Emergency Hotline:** +1-800-RESQFOOD
📧 **Emergency Email:** emergency@resqfood.com
💬 **Live Chat:** Connecting you now...

**Food Safety Emergencies:**
• Contact local health department: 311
• Document with photos if safe
• Isolate affected food immediately
• Report to ResQFood emergency line

**Technical Emergencies:**
• Platform down or critical errors
• Data loss or security concerns
• Payment or billing emergencies

**Urgent Food Needs:**
• Immediate hunger relief: Call 211
• Local food banks: [Auto-detecting your area]
• Emergency meal programs: Available 24/7

**I'm escalating your case to our emergency response team. You should receive contact within 5 minutes.**

Is this a food safety, technical, or urgent need emergency?`,
      priority: 'urgent',
      requiresHuman: true,
      actions: [
        { type: 'external', label: 'Call Emergency Line', value: 'tel:+18007377663' },
        { type: 'action', label: 'Connect to Agent Now', value: 'emergency_agent' },
        { type: 'external', label: 'Local Emergency Services', value: 'tel:211' }
      ]
    };
  }

  public updateContext(newContext: Partial<ChatContext>) {
    this.context = { ...this.context, ...newContext };
  }

  public getContextualSuggestions(): string[] {
    if (!this.context.user) {
      return [
        'How does ResQFood work?',
        'How to register?',
        'What types of organizations can join?',
        'Is ResQFood free to use?'
      ];
    }

    switch (this.context.user.role) {
      case 'restaurant':
      case 'society':
        return [
          'How to add food donations?',
          'Why isn\'t my food being requested?',
          'How to improve my freshness score?',
          'Best practices for food photography',
          'Managing pickup schedules'
        ];
      
      case 'ngo':
        return [
          'How to find available food?',
          'Why are my requests being declined?',
          'Pickup coordination guidelines',
          'How to build donor relationships?',
          'Improving my NGO rating'
        ];
      
      case 'admin':
        return [
          'User verification procedures',
          'System analytics interpretation',
          'Platform moderation tools',
          'Emergency response protocols',
          'Bulk communication features'
        ];
      
      default:
        return [
          'General platform help',
          'Account management',
          'Technical support',
          'Feature requests'
        ];
    }
  }
}