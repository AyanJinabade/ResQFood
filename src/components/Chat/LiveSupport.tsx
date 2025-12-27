import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChatBot } from './ChatBotProvider';
import { 
  User, 
  Clock, 
  AlertCircle, 
  Star,
  Phone,
  Mail,
  MessageSquare,
  FileText
} from 'lucide-react';

interface SupportAgent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'busy' | 'offline';
  specialties: string[];
  rating: number;
  responseTime: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedAgent?: SupportAgent;
  createdAt: Date;
  estimatedResponseTime: string;
}

const LiveSupport = () => {
  useAuth();
  const { createSession } = useChatBot();
  const [availableAgents, setAvailableAgents] = useState<SupportAgent[]>([]);
  const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Mock support agents
  useEffect(() => {
    const mockAgents: SupportAgent[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        status: 'online',
        specialties: ['Food Management', 'NGO Support'],
        rating: 4.9,
        responseTime: '< 2 min'
      },
      {
        id: '2',
        name: 'Mike Chen',
        status: 'online',
        specialties: ['Technical Issues', 'Account Help'],
        rating: 4.8,
        responseTime: '< 3 min'
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        status: 'busy',
        specialties: ['Restaurant Support', 'Billing'],
        rating: 4.9,
        responseTime: '< 5 min'
      }
    ];
    setAvailableAgents(mockAgents);
  }, []);

  const connectToAgent = async (agentId?: string) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedAgent = agentId 
      ? availableAgents.find(a => a.id === agentId)
      : availableAgents.find(a => a.status === 'online') || availableAgents[0];

    if (selectedAgent) {
      const ticket: SupportTicket = {
        id: `TICKET-${Date.now()}`,
        subject: 'Live Support Request',
        status: 'in-progress',
        priority: 'medium',
        category: 'general',
        assignedAgent: selectedAgent,
        createdAt: new Date(),
        estimatedResponseTime: selectedAgent.responseTime
      };

      setCurrentTicket(ticket);
      setConnectionStatus('connected');
    }

    setIsConnecting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'busy': return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'offline': return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (connectionStatus === 'connected' && currentTicket) {
    return (
      <div className="p-4 space-y-4">
        {/* Connected Agent Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-green-800">{currentTicket.assignedAgent?.name}</h3>
                {getStatusIcon(currentTicket.assignedAgent?.status || 'online')}
              </div>
              <p className="text-sm text-green-600">Support Specialist</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-green-700">{currentTicket.assignedAgent?.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-700">Avg: {currentTicket.assignedAgent?.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Ticket: {currentTicket.id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(currentTicket.priority)}`}>
              {currentTicket.priority.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Created: {currentTicket.createdAt.toLocaleString()}
          </div>
        </div>

        {/* Agent Specialties */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Agent Specialties:</h4>
          <div className="flex flex-wrap gap-1">
            {currentTicket.assignedAgent?.specialties.map((specialty, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center space-x-2 p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
            <Phone className="w-4 h-4" />
            <span>Call Agent</span>
          </button>
          <button className="flex items-center space-x-2 p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
            <Mail className="w-4 h-4" />
            <span>Email Ticket</span>
          </button>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'connecting' || isConnecting) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Connecting to Support...</h3>
          <p className="text-sm text-gray-600">Finding the best agent for your needs</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Support Options */}
      <div className="text-center space-y-3">
        <h3 className="font-semibold text-gray-900">Choose Support Type</h3>
        <p className="text-sm text-gray-600">Select the best way to get help</p>
      </div>

      {/* Support Types */}
      <div className="space-y-3">
        <button
          onClick={() => connectToAgent()}
          className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Live Chat Support</div>
              <div className="text-sm text-green-100">Get instant help from our team</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            createSession('ticket', 'general', 'medium');
            connectToAgent();
          }}
          className="w-full p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Create Support Ticket</div>
              <div className="text-sm text-blue-600">For detailed issues that need tracking</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            createSession('emergency', 'urgent', 'urgent');
            connectToAgent();
          }}
          className="w-full p-4 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">Emergency Support</div>
              <div className="text-sm text-red-600">Urgent issues requiring immediate attention</div>
            </div>
          </div>
        </button>
      </div>

      {/* Available Agents */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Available Agents</h4>
        {availableAgents.filter(agent => agent.status === 'online').map((agent) => (
          <div key={agent.id} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{agent.name}</span>
                    {getStatusIcon(agent.status)}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{agent.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => connectToAgent(agent.id)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
              >
                Connect
              </button>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {agent.specialties.map((specialty, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-gray-700">Other Contact Methods</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>+1-800-RESQFOOD (24/7 Emergency)</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>support@resqfood.com</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Business Hours: 9 AM - 6 PM EST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;