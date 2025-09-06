import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import LandingPage from "./components/Views/LandingPage";
import DashboardCards from "./components/Dashboard/DashboardCards";
import RecentActivity from "./components/Dashboard/RecentActivity";
import AddFoodForm from "./components/Food/AddFoodForm";
import FoodCard from "./components/Food/FoodCard";
import AdminDashboard from "./components/Views/AdminDashboard";

// ✅ Chatbot iframe page
const ChatbotPage = () => (
  <div style={{ height: "100vh" }}>
    <iframe
      src="https://resqfood-chatbot-c3mu4zrmo-ayan-jinabades-projects.vercel.app" // Replace with your live chatbot URL
      style={{ width: "100%", height: "100%", border: "none" }}
      title="ResQFood Chatbot"
    ></iframe>
  </div>
);

const AppContent = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("dashboard");

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
      case "dashboard":
        if (user.role === "admin") {
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
                  {user.role === "restaurant" || user.role === "society" ? (
                    <>
                      <button
                        onClick={() => setCurrentView("add-food")}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                      >
                        Add New Food Donation
                      </button>
                      <button
                        onClick={() => setCurrentView("my-donations")}
                        className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        View My Donations
                      </button>
                    </>
                  ) : user.role === "ngo" ? (
                    <>
                      <button
                        onClick={() => setCurrentView("available-food")}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                      >
                        Browse Available Food
                      </button>
                      <button
                        onClick={() => setCurrentView("my-requests")}
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

      case "add-food":
        return <AddFoodForm />;

      case "my-donations":
      case "available-food":
      case "all-donations":
        return <FoodGrid viewType={currentView} />;

      case "profile":
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
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

const FoodGrid = ({ viewType }: { viewType: string }) => {
  const { user } = useAuth();
  const { donations } = useApp();

  const getFilteredDonations = () => {
    switch (viewType) {
      case "my-donations":
        return donations.filter((d) => d.userId === user?.id);
      case "available-food":
        return donations.filter(
          (d) => d.status === "available" && d.userId !== user?.id
        );
      case "all-donations":
        return donations;
      default:
        return [];
    }
  };

  const filteredDonations = getFilteredDonations();

  const getTitle = () => {
    switch (viewType) {
      case "my-donations":
        return "My Food Donations";
      case "available-food":
        return "Available Food Near You";
      case "all-donations":
        return "All Food Donations";
      default:
        return "Food Listings";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <div className="text-sm text-gray-600">
          {filteredDonations.length}{" "}
          {filteredDonations.length === 1 ? "item" : "items"}
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No food items found
          </h3>
          <p className="text-gray-600 mb-4">
            {viewType === "available-food"
              ? "There's no available food in your area right now. Check back soon!"
              : "You haven't added any food donations yet."}
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
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.location.address || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      location: {
        ...user!.location,
        address: formData.address,
      },
    });
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields... */}
        </form>
      </div>
    </div>
  );
};

// ✅ Main App with Routing
function RootApp() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Chatbot route */}
            <Route path="/chat" element={<ChatbotPage />} />
            {/* Default content */}
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default RootApp;
