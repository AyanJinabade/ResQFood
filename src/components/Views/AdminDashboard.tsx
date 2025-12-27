import { useApp } from '../../context/AppContext';
import {
  Users,
  TrendingUp,
  Clock,
  Heart,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Define the type for the stats object returned by getAdminStats
interface AdminStats {
  totalUsers: number;
  totalDonations: number;
  activeDonations: number;
  totalServed: number;
  monthlyDonations: { month: string; count: number }[];
  usersByRole: Record<string, number>;
  donationsByType: Record<string, number>;
}

// Define the AppContextType interface
interface AppContextType {
  getAdminStats: () => AdminStats;
}

const AdminDashboard = () => {
  const { getAdminStats } = useApp() as unknown as AppContextType;
  const stats = getAdminStats();

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'High demand in Brooklyn area', time: '2 hours ago' },
    { id: 2, type: 'success', message: '500+ meals rescued today', time: '4 hours ago' },
    { id: 3, type: 'info', message: 'New NGO partnership approved', time: '6 hours ago' },
  ];

  const topPerformers = [
    { name: 'Green Garden Restaurant', donations: 45, served: 230 },
    { name: 'Helping Hands NGO', collected: 38, beneficiaries: 180 },
    { name: 'Sunset Society', donations: 32, served: 160 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">System overview and management console</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', change: '+18%' },
          { title: 'Total Donations', value: stats.totalDonations, icon: TrendingUp, color: 'bg-green-500', change: '+12%' },
          { title: 'Active Today', value: stats.activeDonations, icon: Clock, color: 'bg-orange-500', change: '+7%' },
          { title: 'People Fed', value: stats.totalServed, icon: Heart, color: 'bg-red-500', change: '+24%' },
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donation Trends</h3>
          <div className="space-y-4">
            {stats.monthlyDonations.map((month: { month: string; count: number }) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">{month.month}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: `${(month.count / 250) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {month.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />}
                {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                {alert.type === 'info' && <Clock className="w-5 h-5 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.usersByRole).map(([role, count]: [string, number]) => (
              <div key={role} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      {
                        restaurant: 'bg-blue-500',
                        society: 'bg-purple-500',
                        ngo: 'bg-green-500',
                        admin: 'bg-red-500',
                      }[role] || 'bg-gray-500'
                    }`}
                  ></div>
                  <span className="text-gray-700 capitalize font-medium">{role}s</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        {
                          restaurant: 'bg-blue-500',
                          society: 'bg-purple-500',
                          ngo: 'bg-green-500',
                          admin: 'bg-red-500',
                        }[role] || 'bg-gray-500'
                      }`}
                      style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-500">
                      {performer.donations ? `${performer.donations} donations` : `${performer.collected} collections`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    {performer.served ? `${performer.served} served` : `${performer.beneficiaries} beneficiaries`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Type Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Type Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(stats.donationsByType).map(([type, count]: [string, number]) => (
            <div key={type} className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl mb-2">
                {{
                  meals: '🍽️',
                  bakery: '🍞',
                  fruits: '🍎',
                  vegetables: '🥬',
                  dairy: '🥛',
                  other: '📦',
                }[type] || '📦'}
              </div>
              <p className="text-sm font-medium text-gray-900 capitalize">{type}</p>
              <p className="text-lg font-bold text-green-600">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;