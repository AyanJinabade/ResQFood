import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle, AlertCircle, Heart, UtensilsCrossed } from 'lucide-react';

const RecentActivity = () => {
  const { user, profile } = useAuth();
  const { donations, requests } = useApp();

  const getRecentActivity = () => {
    if (!user || !profile) return [];

    const activities = [];

    // Get user's recent donations
    if (profile.role === 'restaurant' || profile.role === 'society') {
      const myDonations = donations
        .filter(d => d.donor_id === user.id)
        .slice(0, 5)
        .map(d => ({
          id: d.id,
          type: 'donation',
          title: `Added ${d.food_name}`,
          description: `${d.quantity} ${d.unit} • ${d.food_type}`,
          time: d.created_at,
          status: d.status,
          icon: d.status === 'collected' ? CheckCircle : d.status === 'available' ? Clock : AlertCircle
        }));
      activities.push(...myDonations);
    }

    // Get NGO's recent requests
    if (profile.role === 'ngo') {
      const myRequests = requests
        .filter(r => r.ngo_id === user.id)
        .slice(0, 5)
        .map(r => {
          const donation = donations.find(d => d.id === r.donation_id);
          return {
            id: r.id,
            type: 'request',
            title: `Requested ${donation?.food_name || 'Food'}`,
            description: `From ${donation?.donor?.name || 'Unknown'} • ${r.status}`,
            time: r.created_at,
            status: r.status,
            icon: r.status === 'collected' ? CheckCircle : r.status === 'accepted' ? Heart : Clock
          };
        });
      activities.push(...myRequests);
    }

    // Admin sees all activities
    if (profile.role === 'admin') {
      const recentDonations = donations.slice(0, 3).map(d => ({
        id: d.id,
        type: 'donation',
        title: `${d.donor?.name || 'Someone'} added ${d.food_name}`,
        description: `${d.quantity} ${d.unit} • ${d.food_type}`,
        time: d.created_at,
        status: d.status,
        icon: UtensilsCrossed
      }));
      activities.push(...recentDonations);

      const recentRequests = requests.slice(0, 2).map(r => ({
        id: r.id,
        type: 'request',
        title: `${r.ngo?.name || 'An NGO'} made a request`,
        description: `Status: ${r.status}`,
        time: r.created_at,
        status: r.status,
        icon: Heart
      }));
      activities.push(...recentRequests);
    }

    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);
  };

  const activities = getRecentActivity();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'pending':
        return 'text-blue-600 bg-blue-50';
      case 'collected':
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'expired':
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 rounded-full bg-gray-100">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;