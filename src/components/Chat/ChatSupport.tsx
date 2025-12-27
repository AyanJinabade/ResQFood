import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Phone,
  X
} from 'lucide-react';

interface ChatSupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  lastMessage: string;
  lastActivity: Date;
  assignedAgent?: string;
  responseTime?: string;
}

interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  commonIssues: string[];
}

const ChatSupport = () => {
  const { user } = useAuth();
  const { donations } = useApp();
  const [tickets, setTickets] = useState<ChatSupportTicket[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    description: ''
  });

  // Support categories based on ResQFood features
  const supportCategories: SupportCategory[] = [
    {
      id: 'food-management',
      name: 'Food Management',
      description: 'Adding, editing, and managing food donations',
      icon: MessageSquare,
      commonIssues: [
        'How to add food donations',
        'Editing existing donations',
        'Managing expiry times',
        'Improving freshness scores',
        'Photo upload issues'
      ]
    },
    {
      id: 'ngo-support',
      name: 'NGO Support',
      description: 'Finding food, making requests, pickup coordination',
      icon: Search,
      commonIssues: [
        'Finding available food',
        'Making food requests',
        'Pickup coordination',
        'Request status tracking',
        'Communication with donors'
      ]
    },
    {
      id: 'account-help',
      name: 'Account Help',
      description: 'Profile, settings, and account management',
      icon: User,
      commonIssues: [
        'Profile setup and verification',
        'Password reset',
        'Notification settings',
        'Location updates',
        'Account verification'
      ]
    },
    {
      id: 'technical',
      name: 'Technical Issues',
      description: 'App bugs, performance, and technical problems',
      icon: AlertCircle,
      commonIssues: [
        'App not loading',
        'Login problems',
        'Feature not working',
        'Mobile app issues',
        'Browser compatibility'
      ]
    }
  ];

  // Mock existing tickets
  useEffect(() => {
    if (user) {
      const mockTickets: ChatSupportTicket[] = [
        {
          id: 'TICKET-001',
          subject: 'Unable to upload food photos',
          status: 'in-progress',
          priority: 'medium',
          category: 'technical',
          lastMessage: 'Our team is investigating the photo upload issue...',
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          assignedAgent: 'Mike Chen',
          responseTime: '< 1 hour'
        },
        {
          id: 'TICKET-002',
          subject: 'How to improve freshness score?',
          status: 'resolved',
          priority: 'low',
          category: 'food-management',
          lastMessage: 'Thank you for the detailed explanation!',
          lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
          assignedAgent: 'Sarah Johnson'
        }
      ];
      setTickets(mockTickets);
    }
  }, [user]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket: ChatSupportTicket = {
      id: `TICKET-${Date.now()}`,
      subject: newTicketForm.subject,
      status: 'open',
      priority: newTicketForm.priority,
      category: newTicketForm.category,
      lastMessage: newTicketForm.description,
      lastActivity: new Date(),
      responseTime: '< 2 hours'
    };

    setTickets(prev => [newTicket, ...prev]);
    setShowNewTicket(false);
    setNewTicketForm({
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    });

    // Simulate auto-assignment
    setTimeout(() => {
      setTickets(prev => prev.map(ticket => 
        ticket.id === newTicket.id 
          ? { ...ticket, status: 'in-progress', assignedAgent: 'Sarah Johnson' }
          : ticket
      ));
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || ticket.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (showNewTicket) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Create Support Ticket</h3>
          <button
            onClick={() => setShowNewTicket(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={newTicketForm.subject}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={newTicketForm.category}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select category</option>
                {supportCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTicketForm.priority}
                onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              value={newTicketForm.description}
              onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Please provide detailed information about your issue..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Create Ticket
          </button>
        </form>
      </div>
    );
  }

  function connectToAgent(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Support Center</h3>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => connectToAgent()}
          className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live Chat</span>
        </button>
        <button className="flex items-center space-x-2 p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
          <Phone className="w-4 h-4" />
          <span>Call Support</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search tickets..."
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All Categories</option>
          {supportCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Support Categories */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">Browse by Category</h4>
        {supportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{category.name}</h5>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2 ml-11">
                <details className="text-sm">
                  <summary className="text-green-600 cursor-pointer hover:text-green-700">
                    Common Issues
                  </summary>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    {category.commonIssues.map((issue, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tickets */}
      {tickets.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Your Recent Tickets</h4>
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(ticket.status)}
                    <span className="font-medium text-gray-900">{ticket.subject}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ticket.lastMessage}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>ID: {ticket.id}</span>
                    <span>{ticket.lastActivity.toLocaleDateString()}</span>
                    {ticket.assignedAgent && <span>Agent: {ticket.assignedAgent}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  {ticket.responseTime && (
                    <span className="text-xs text-green-600">{ticket.responseTime}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h4 className="font-medium text-red-800">Emergency Support</h4>
        </div>
        <p className="text-sm text-red-700 mb-3">
          For urgent food safety issues or critical technical problems
        </p>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </button>
          <span className="text-sm text-red-600 font-medium">+1-800-RESQFOOD</span>
        </div>
      </div>

      {/* User Context Info */}
      {user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-800 mb-2">Your Account Info</h4>
          <div className="space-y-1 text-sm text-blue-700">
            <div>Role: {user.role}</div>
            <div>Email: {user.email}</div>
            {user.role !== 'admin' && (
              <div>
                Active Donations: {donations.filter(d => d.userId === user.id && d.status === 'available').length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSupport;