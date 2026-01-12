import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NGOProfileLocation from "./components/Profile/NGOProfileLocation";

// ✅ Context Providers
import { AuthProvider, supabase, useAuth } from "./context/AuthContext";
import { AppProvider, useApp } from "./context/AppContext";

// ✅ Layout
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import LandingPage from "./components/Views/LandingPage";

// ✅ Dashboard + Forms
import DashboardCards from "./components/Dashboard/DashboardCards";
import RecentActivity from "./components/Dashboard/RecentActivity";
import AddFoodForm from "./components/Food/AddFoodForm";
import FoodCard from "./components/Food/FoodCard";
import AdminDashboard from "./components/Views/AdminDashboard";

// ✅ Real NGO Dashboard
import AvailableDonations from "./components/Food/AvailableDonations";

// ✅ Restaurant Dashboard (My Donations)
import MyDonations from "./components/Food/MyDonations";


// ✅ Chatbot Page
const ChatbotPage = () => (
  <div className="h-screen w-screen">
    <iframe
      src="https://resqfood-chatbot-c3mu4zrmo-ayan-jinabades-projects.vercel.app"
      style={{ width: "100%", height: "100%", border: "none" }}
      title="ResQFood Chatbot"
    />
  </div>
);


// ✅ Profile Settings Page
const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile({
      full_name: formData.full_name,
      phone: formData.phone,
      address: formData.address,
    });
    if (success) alert("✅ Profile updated successfully!");
    else alert("❌ Failed to update profile.");
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Profile Settings
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Full Name / Organization Name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};


// ✅ Food Listing Grid Page (Fallback View)
const FoodGrid = ({ viewType }: { viewType: string }) => {
  const { user } = useAuth();
  const { donations } = useApp();

  const filtered = (() => {
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
  })();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 capitalize">
        {viewType.replace("-", " ")}
      </h1>
      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 py-10">No food found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((donation) => (
            <FoodCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </div>
  );
};


// ✅ Main Authenticated Layout
const AppContent = () => {
  const { user } = useAuth();
  const [view, setView] = useState("dashboard");

useEffect(() => {
  if (!user) return;

  const checkNgoLocation = async () => {
    if (user.role !== "ngo") return;

    const { data, error } = await supabase
      .from("profiles")
      .select("latitude, longitude")
      .eq("email", user.email)
      .single();

    if (error || !data?.latitude || !data?.longitude) {
      setView("ngo-location");
    } else {
      setView("available-food");
    }
  };

  checkNgoLocation();
}, [user]);


  if (!user) return <LandingPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar currentView={view} onViewChange={setView} />

        <main className="flex-1 p-6">
          {/* 🏠 Dashboard */}
          {view === "dashboard" && (
            user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <div className="space-y-6">
                <DashboardCards />

                <div className="grid lg:grid-cols-2 gap-6">
                  <RecentActivity />

                  <button
                    onClick={() =>
                      setView(
                        user.role === "ngo"
                          ? "available-food"
                          : "add-food"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg"
                  >
                    {user.role === "ngo"
                      ? "Browse Available Food"
                      : "Add Donation"}
                  </button>
                </div>
              </div>
            )
          )}

          {/* 📍 NGO Location Setup */}
          {view === "ngo-location" && <NGOProfileLocation />}

          {/* 🧾 Add Food (Restaurant) */}
          {view === "add-food" && <AddFoodForm />}

          {/* 📦 My Donations (Restaurant) */}
          {view === "my-donations" && <MyDonations />}

          {/* 🤝 Available Donations (NGO) */}
          {view === "available-food" && <AvailableDonations />}

          {/* 📋 All Donations */}
          {view === "all-donations" && <FoodGrid viewType={view} />}

          {/* 👤 Profile Settings */}
          {view === "profile" && <ProfileSettings />}
        </main>
      </div>
    </div>
  );
};



// ✅ Root App Wrapper
export default function RootApp() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
