import { User, FoodDonation } from '../types';
export type Intent =
  | 'help_add_food'
  | 'help_find_food'
  | 'help_account'
  | 'help_requests'
  | 'help_technical'
  | 'help_navigation'
  | 'emergency'
  | 'feedback'
  | 'general_info'
  | 'general';

export type Urgency = 'low' | 'medium' | 'high' | 'urgent';

export type Category =
  | 'food_management'
  | 'ngo_operations'
  | 'account_management'
  | 'technical_support'
  | 'platform_navigation'
  | 'billing_payment'
  | 'general_inquiry';

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
  priority?: Urgency;
  requiresHuman?: boolean;
}
export class DynamicChatBot {
  private context: ChatContext;

  constructor(context: ChatContext) {
    this.context = context;
  }

  public generateResponse(userMessage: string): ChatResponse {
    const message = (userMessage || '').toLowerCase().trim();

    if (!message) {
      return this.buildGeneralResponse("empty input", 'general', 'general_inquiry');
    }

    const intent = this.analyzeIntent(message);
    const urgency = this.detectUrgency(message);
    const category = this.categorizeMessage(message);

    return this.buildResponse(message, intent, urgency, category);
  }
  private analyzeIntent(message: string): Intent {
    const intents: Record<Intent, string[]> = {
      help_add_food: ['add food', 'create donation', 'post food'],
      help_find_food: ['find food', 'available food', 'search food'],
      help_account: ['account', 'profile', 'settings'],
      help_requests: ['request', 'pickup', 'collect'],
      help_technical: ['bug', 'error', 'issue'],
      help_navigation: ['how to', 'where is', 'navigate'],
      emergency: ['urgent', 'emergency', 'asap'],
      feedback: ['feedback', 'suggestion'],
      general_info: ['what is', 'how does'],
      general: []
    };

    return (
      Object.entries(intents).find(([_, keywords]) =>
        keywords.some(k => message.includes(k))
      )?.[0] as Intent || 'general'
    );
  }
  private detectUrgency(message: string): Urgency {
    if (/(urgent|emergency|asap|critical)/.test(message)) return 'urgent';
    if (/(fast|quick|important)/.test(message)) return 'high';
    if (/(no rush|later)/.test(message)) return 'low';
    return 'medium';
  }
  private categorizeMessage(message: string): Category {
    if (message.includes('food')) return 'food_management';
    if (message.includes('ngo')) return 'ngo_operations';
    if (message.includes('account')) return 'account_management';
    if (message.includes('error')) return 'technical_support';
    if (message.includes('how')) return 'platform_navigation';
    return 'general_inquiry';
  }
  private buildResponse(
    message: string,
    intent: Intent,
    urgency: Urgency,
    category: Category
  ): ChatResponse {

    if (urgency === 'urgent' || intent === 'emergency') {
      return this.buildEmergencyResponse();
    }

    const role = this.context.user?.role;

    if (role === 'restaurant' || role === 'society') {
      return this.buildDonorResponse(message, intent);
    }

    if (role === 'ngo') {
      return this.buildNGOResponse(message, intent);
    }

    if (role === 'admin') {
      return this.buildAdminResponse();
    }

    return this.buildGeneralResponse(message, intent, category);
  }
  private buildDonorResponse(message: string, intent: Intent): ChatResponse {
    const stats = this.context.userStats;

    if (intent === 'help_add_food') {
      return {
        text: `Add food easily 🍽️

Active: ${stats?.activeDonations || 0}
Total: ${stats?.totalDonations || 0}`,
        suggestions: ['Improve freshness score', 'Best posting time']
      };
    }

    return {
      text: `I understand you're asking: "${message}"`,
      suggestions: ['Add donation', 'View my food']
    };
  }

  private buildNGOResponse(message: string, intent: Intent): ChatResponse {
    return {
      text: `Helping NGOs find food 🔍

You asked: "${message}"`,
      suggestions: ['Find nearby food', 'View requests']
    };
  }

  private buildAdminResponse(): ChatResponse {
    return {
      text: `Admin tools ready 🛠️`,
      suggestions: ['User management', 'System analytics']
    };
  }

  private buildGeneralResponse(
    message: string,
    _intent: Intent,
    _category: Category
  ): ChatResponse {
    return {
      text: `How can I help with "${message}"?`,
      suggestions: ['Help', 'Live support']
    };
  }

  private buildEmergencyResponse(): ChatResponse {
    return {
      text: `🚨 Emergency detected. Connecting to support.`,
      priority: 'urgent',
      requiresHuman: true
    };
  }
  public updateContext(newContext: Partial<ChatContext>) {
    this.context = { ...this.context, ...newContext };
  }
}
