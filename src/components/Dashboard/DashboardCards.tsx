import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  UtensilsCrossed,
  Users,
  Clock,
  Heart,
  TrendingUp,
  MapPin,
  Award
} from "lucide-react";

const DashboardCards = () => {
  const { user, profile } = useAuth();
  const { donations, requests, analytics } = useApp();

  const stats = useMemo(() => {
    if (!user || !profile) return {};

    if (profile.role === "restaurant" || profile.role === "society") {
      const myDonations = donations.filter(d => d.donor_id === user.id);

      const active = myDonations.filter(d => d.status === "available");
      const completed = myDonations.filter(d => d.status === "collected");

      const totalServed = completed.reduce(
        (sum, d) => sum + (d.quantity || 0),
        0
      );

      const avgFreshness =
        myDonations.length > 0
          ? myDonations.reduce(
              (sum, d) => sum + (d.freshness_score || 0),
              0
            ) / myDonations.length
          : 0;

      return {
        totalDonations: myDonations.length,
        activeDonations: active.length,
        completedDonations: completed.length,
        totalServed,
        avgFreshness
      };
    }

    if (profile.role === "ngo") {
      const myRequests = requests.filter(r => r.ngo_id === user.id);
      const accepted = myRequests.filter(r => r.status === "accepted");
      const collected = myRequests.filter(r => r.status === "collected");

      const availableFood = donations.filter(d => d.status === "available");

      const totalServed = collected.reduce((sum, r) => {
        const donation = donations.find(d => d.id === r.donation_id);
        return sum + (donation?.quantity || 0);
      }, 0);

      return {
        availableFood: availableFood.length,
        pendingRequests: myRequests.filter(r => r.status === "pending").length,
        acceptedRequests: accepted.length,
        collectedMeals: collected.length,
        totalServed
      };
    }

    if (profile.role === "admin") {
      const avgFreshness =
        donations.length > 0
          ? donations.reduce(
              (sum, d) => sum + (d.freshness_score || 0),
              0
            ) / donations.length
          : 0;

      return {
        totalUsers: analytics?.totalUsers || 0,
        totalDonations: analytics?.totalDonations || 0,
        activeDonations: analytics?.activeDonations || 0,
        totalServed: analytics?.totalRequests || 0,
        avgFreshness
      };
    }

    return {};
  }, [user, profile, donations, requests, analytics]);

  const cards = useMemo(() => {
    if (!profile) return [];

    if (profile.role === "restaurant" || profile.role === "society") {
      return [
        {
          id: "donations",
          title: "Total Donations",
          value: stats.totalDonations || 0,
          icon: UtensilsCrossed,
          color: "bg-blue-500",
          change: "+12%",
          changeType: "positive"
        },
        {
          id: "active",
          title: "Active Listings",
          value: stats.activeDonations || 0,
          icon: Clock,
          color: "bg-orange-500",
          change: "+5%",
          changeType: "positive"
        },
        {
          id: "served",
          title: "People Served",
          value: stats.totalServed || 0,
          icon: Heart,
          color: "bg-green-500",
          change: "+23%",
          changeType: "positive"
        },
        {
          id: "freshness",
          title: "Avg. Freshness",
          value: `${Math.round(stats.avgFreshness || 0)}%`,
          icon: Award,
          color: "bg-purple-500",
          change: "+3%",
          changeType: "positive"
        }
      ];
    }

    if (profile.role === "ngo") {
      return [
        {
          id: "available",
          title: "Available Food",
          value: stats.availableFood || 0,
          icon: MapPin,
          color: "bg-green-500",
          change: "+8%",
          changeType: "positive"
        },
        {
          id: "pending",
          title: "Pending Requests",
          value: stats.pendingRequests || 0,
          icon: Clock,
          color: "bg-orange-500",
          change: "-2%",
          changeType: "negative"
        },
        {
          id: "accepted",
          title: "Accepted Today",
          value: stats.acceptedRequests || 0,
          icon: TrendingUp,
          color: "bg-blue-500",
          change: "+15%",
          changeType: "positive"
        },
        {
          id: "served",
          title: "Total Served",
          value: stats.totalServed || 0,
          icon: Heart,
          color: "bg-red-500",
          change: "+31%",
          changeType: "positive"
        }
      ];
    }

    if (profile.role === "admin") {
      return [
        {
          id: "users",
          title: "Total Users",
          value: stats.totalUsers || 0,
          icon: Users,
          color: "bg-blue-500",
          change: "+18%",
          changeType: "positive"
        },
        {
          id: "donations",
          title: "Total Donations",
          value: stats.totalDonations || 0,
          icon: UtensilsCrossed,
          color: "bg-green-500",
          change: "+12%",
          changeType: "positive"
        },
        {
          id: "active",
          title: "Active Today",
          value: stats.activeDonations || 0,
          icon: TrendingUp,
          color: "bg-orange-500",
          change: "+7%",
          changeType: "positive"
        },
        {
          id: "fed",
          title: "People Fed",
          value: stats.totalServed || 0,
          icon: Heart,
          color: "bg-red-500",
          change: "+24%",
          changeType: "positive"
        }
      ];
    }

    return [];
  }, [profile, stats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>

                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>

                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.change}
                  </span>

                  <span className="text-sm text-gray-500 ml-2">
                    vs last week
                  </span>
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
