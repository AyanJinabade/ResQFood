import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/Views/LandingPage';
import DashboardCards from './components/Dashboard/DashboardCards';
import RecentActivity from './components/Dashboard/RecentActivity';
import AddFoodForm from './components/Food/AddFoodForm';
import FoodCard from './components/Food/FoodCard';
import AdminDashboard from './components/Views/AdminDashboard';

const AppContent = () => {
  const { user, profile, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ResQFood...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <LandingPage />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (profile?.role === 'admin') {
          return <AdminDashboard />;
        }
        return (
          <div className="space-y-6">
            <DashboardCards />
            <div className="grid lg:grid-cols-2 gap-6">
              <RecentActivity />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {profile?.role === 'restaurant' || profile?.role === 'society' ? (
                    <>
                      <button
                        onClick={() => setCurrentView('add-food')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                      >
                        Add New Food Donation
                      </button>
                      <button
                        onClick={() => setCurrentView('my-donations')}
                        className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        View My Donations
                      </button>
                    </>
                  ) : profile?.role === 'ngo' ? (
                    <>
                      <button
                        onClick={() => setCurrentView('available-food')}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                      >
                        Browse Available Food
                      </button>
                      <button
                        onClick={() => setCurrentView('my-requests')}
                        className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        My Requests
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );

      case 'add-food':
        return <AddFoodForm />;

      case 'my-donations':
      case 'available-food':
      case 'all-donations':
        return <FoodGrid viewType={currentView} />;

      case 'profile':
        return <ProfileSettings />;

      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">This feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const FoodGrid = ({ viewType }: { viewType: string }) => {
  const { user } = useAuth();
  const { donations } = useApp();

  const getFilteredDonations = () => {
    switch (viewType) {
      case 'my-donations':
        return donations.filter(d => d.donor_id === user?.id);
      case 'available-food':
        return donations.filter(d => d.status === 'available' && d.donor_id !== user?.id);
      case 'all-donations':
        return donations;
      default:
        return [];
    }
  };

  const filteredDonations = getFilteredDonations();

  const getTitle = () => {
    switch (viewType) {
      case 'my-donations': return 'My Food Donations';
      case 'available-food': return 'Available Food Near You';
      case 'all-donations': return 'All Food Donations';
      default: return 'Food Listings';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <div className="text-sm text-gray-600">
          {filteredDonations.length} {filteredDonations.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No food items found</h3>
          <p className="text-gray-600 mb-4">
            {viewType === 'available-food' 
              ? "There's no available food in your area right now. Check back soon!"
              : "You haven't added any food donations yet."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <FoodCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileSettings = () => {
  const { profile, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    address: profile?.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Email: {profile?.email}</div>
              <div>Role: {profile?.role}</div>
              <div>Member since: {new Date(profile?.created_at || '').toLocaleDateString()}</div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;