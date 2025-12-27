import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  Users,
  Clock,
  Heart,
  TrendingUp,
  MapPin,
  Award
} from 'lucide-react';

const DashboardCards = () => {
  const { user, profile } = useAuth();
  const { donations, requests, analytics } = useApp();

  const getStats = () => {
    if (!user || !profile) return {};

    switch (profile.role) {
      case 'restaurant':
      case 'society':
        const myDonations = donations.filter(d => d.donor_id === user.id);
        const activeDonations = myDonations.filter(d => d.status === 'available');
        const completedDonations = myDonations.filter(d => d.status === 'collected');
        const totalServed = myDonations.reduce((sum, d) => {
          return d.status === 'collected' ? sum + d.quantity : sum;
        }, 0);

        return {
          totalDonations: myDonations.length,
          activeDonations: activeDonations.length,
          completedDonations: completedDonations.length,
          totalServed,
          avgFreshness: myDonations.reduce((sum, d) => sum + d.freshness_score, 0) / myDonations.length || 0
        };

      case 'ngo':
        const myRequests = requests.filter(r => r.ngo_id === user.id);
        const acceptedRequests = myRequests.filter(r => r.status === 'accepted');
        const collectedRequests = myRequests.filter(r => r.status === 'collected');
        const availableFood = donations.filter(d => d.status === 'available');

        return {
          availableFood: availableFood.length,
          pendingRequests: myRequests.filter(r => r.status === 'pending').length,
          acceptedRequests: acceptedRequests.length,
          collectedMeals: collectedRequests.length,
          totalServed: collectedRequests.reduce((sum, r) => {
            const donation = donations.find(d => d.id === r.donation_id);
            return donation ? sum + donation.quantity : sum;
          }, 0)
        };

      case 'admin':
        return {
          totalUsers: analytics.totalUsers,
          totalDonations: analytics.totalDonations,
          activeDonations: analytics.activeDonations,
          totalServed: analytics.totalRequests,
          avgFreshness: donations.reduce((sum, d) => sum + d.freshness_score, 0) / donations.length || 0
        };

      default:
        return {};
    }
  };

  const stats = getStats();

  const getCards = () => {
    switch (profile?.role) {
      case 'restaurant':
      case 'society':
        return [
          {
            title: 'Total Donations',
            value: stats.totalDonations || 0,
            icon: UtensilsCrossed,
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive'
          },
          {
            title: 'Active Listings',
            value: stats.activeDonations || 0,
            icon: Clock,
            color: 'bg-orange-500',
            change: '+5%',
            changeType: 'positive'
          },
          {
            title: 'People Served',
            value: stats.totalServed || 0,
            icon: Heart,
            color: 'bg-green-500',
            change: '+23%',
            changeType: 'positive'
          },
          {
            title: 'Avg. Freshness',
            value: `${Math.round(stats.avgFreshness || 0)}%`,
            icon: Award,
            color: 'bg-purple-500',
            change: '+3%',
            changeType: 'positive'
          }
        ];

      case 'ngo':
        return [
          {
            title: 'Available Food',
            value: stats.availableFood || 0,
            icon: MapPin,
            color: 'bg-green-500',
            change: '+8%',
            changeType: 'positive'
          },
          {
            title: 'Pending Requests',
            value: stats.pendingRequests || 0,
            icon: Clock,
            color: 'bg-orange-500',
            change: '-2%',
            changeType: 'negative'
          },
          {
            title: 'Accepted Today',
            value: stats.acceptedRequests || 0,
            icon: TrendingUp,
            color: 'bg-blue-500',
            change: '+15%',
            changeType: 'positive'
          },
          {
            title: 'Total Served',
            value: stats.totalServed || 0,
            icon: Heart,
            color: 'bg-red-500',
            change: '+31%',
            changeType: 'positive'
          }
        ];

      case 'admin':
        return [
          {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'bg-blue-500',
            change: '+18%',
            changeType: 'positive'
          },
          {
            title: 'Total Donations',
            value: stats.totalDonations || 0,
            icon: UtensilsCrossed,
            color: 'bg-green-500',
            change: '+12%',
            changeType: 'positive'
          },
          {
            title: 'Active Today',
            value: stats.activeDonations || 0,
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '+7%',
            changeType: 'positive'
          },
          {
            title: 'People Fed',
            value: stats.totalServed || 0,
            icon: Heart,
            color: 'bg-red-500',
            change: '+24%',
            changeType: 'positive'
          }
        ];

      default:
        return [];
    }
  };

  const cards = getCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
