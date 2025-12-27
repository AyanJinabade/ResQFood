import { 
  MessageSquare, 
  Users, 
  Clock,
  ThumbsUp,
  BarChart3,
  Calendar
} from 'lucide-react';

const ChatBotAnalytics = () => {
  // Mock analytics data - in real app, this would come from your analytics service
  const analytics = {
    totalConversations: 1247,
    activeUsers: 89,
    avgResponseTime: '1.2s',
    satisfactionRate: 94,
    topQueries: [
      { query: 'How to add food?', count: 156, percentage: 23 },
      { query: 'Find available food', count: 134, percentage: 20 },
      { query: 'Pickup guidelines', count: 98, percentage: 15 },
      { query: 'Registration help', count: 87, percentage: 13 },
      { query: 'Contact support', count: 76, percentage: 11 }
    ],
    dailyStats: [
      { day: 'Mon', conversations: 45, satisfaction: 92 },
      { day: 'Tue', conversations: 52, satisfaction: 95 },
      { day: 'Wed', conversations: 38, satisfaction: 89 },
      { day: 'Thu', conversations: 61, satisfaction: 97 },
      { day: 'Fri', conversations: 73, satisfaction: 94 },
      { day: 'Sat', conversations: 29, satisfaction: 91 },
      { day: 'Sun', conversations: 34, satisfaction: 93 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">ChatBot Analytics</h1>
        <p className="text-purple-100">Monitor ResQBot performance and user interactions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Conversations',
            value: analytics.totalConversations.toLocaleString(),
            icon: MessageSquare,
            color: 'bg-blue-500',
            change: '+18%'
          },
          {
            title: 'Active Users',
            value: analytics.activeUsers,
            icon: Users,
            color: 'bg-green-500',
            change: '+12%'
          },
          {
            title: 'Avg Response Time',
            value: analytics.avgResponseTime,
            icon: Clock,
            color: 'bg-orange-500',
            change: '-5%'
          },
          {
            title: 'Satisfaction Rate',
            value: `${analytics.satisfactionRate}%`,
            icon: ThumbsUp,
            color: 'bg-purple-500',
            change: '+3%'
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <span className="text-sm font-medium text-green-600">{metric.change}</span>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Queries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top User Queries</h3>
          <div className="space-y-4">
            {analytics.topQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{query.query}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${query.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-semibold text-gray-900">{query.count}</p>
                  <p className="text-xs text-gray-500">{query.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
          <div className="space-y-4">
            {analytics.dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{day.day}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{day.conversations}</p>
                    <p className="text-xs text-gray-500">conversations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{day.satisfaction}%</p>
                    <p className="text-xs text-gray-500">satisfaction</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Conversation Trends</h3>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Last 7 days</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 h-32">
          {analytics.dailyStats.map((day, index) => (
            <div key={index} className="flex flex-col items-center justify-end">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                style={{ height: `${(day.conversations / 80) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-600 mt-2">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Feedback */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Feedback</h3>
        <div className="space-y-4">
          {[
            {
              user: 'Green Garden Restaurant',
              feedback: 'ResQBot helped me understand how to add food donations quickly!',
              rating: 5,
              time: '2 hours ago'
            },
            {
              user: 'Helping Hands NGO',
              feedback: 'Great support for finding available food in our area.',
              rating: 4,
              time: '5 hours ago'
            },
            {
              user: 'Community Kitchen',
              feedback: 'The pickup guidelines were very helpful and detailed.',
              rating: 5,
              time: '1 day ago'
            }
          ].map((feedback, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{feedback.user}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{feedback.feedback}</p>
              <span className="text-xs text-gray-500">{feedback.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBotAnalytics;