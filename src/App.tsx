import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Context */
import { AuthProvider, supabase, useAuth } from "./context/AuthContext";
import { AppProvider, useApp } from "./context/AppContext";

/* Layout */
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import LandingPage from "./components/Views/LandingPage";

/* Dashboard */
import DashboardCards from "./components/Dashboard/DashboardCards";
import RecentActivity from "./components/Dashboard/RecentActivity";

/* Food */
import AddFoodForm from "./components/Food/AddFoodForm";
import AvailableDonations from "./components/Food/AvailableDonations";
import MyDonations from "./components/Food/MyDonations";
import FoodCard from "./components/Food/FoodCard";

/* Views */
import AdminDashboard from "./components/Views/AdminDashboard";
import NGOProfileLocation from "./components/Profile/NGOProfileLocation";


/* ---------------- Chatbot Page ---------------- */

const ChatbotPage = () => (
  <div className="h-screen w-screen">
    <iframe
      src="https://resqfood-chatbot-c3mu4zrmo-ayan-jinabades-projects.vercel.app"
      title="ResQFood Chatbot"
      className="w-full h-full border-none"
    />
  </div>
);


/* ---------------- Profile Settings ---------------- */

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateProfile(formData);

    if (success) alert("✅ Profile updated successfully!");
    else alert("❌ Failed to update profile.");
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border p-3 rounded"
            placeholder="Full Name / Organization"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};


/* ---------------- Food Grid ---------------- */

const FoodGrid = ({ viewType }: { viewType: string }) => {
  const { user } = useAuth();
  const { donations } = useApp();

  const filtered = donations.filter((d) => {
    if (viewType === "my-donations") return d.userId === user?.id;
    if (viewType === "available-food")
      return d.status === "available" && d.userId !== user?.id;
    if (viewType === "all-donations") return true;
    return false;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold capitalize">
        {viewType.replace("-", " ")}
      </h1>

      {filtered.length === 0 ? (
        <div className="text-gray-600 text-center py-10">No food found.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((donation) => (
            <FoodCard key={donation.id} donation={donation} />
          ))}
        </div>
      )}
    </div>
  );
};


/* ---------------- Main App Layout ---------------- */

const AppContent = () => {
  const { user } = useAuth();
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    if (!user) return;

    const checkNgoLocation = async () => {
      if (user.role !== "ngo") return;

      const { data } = await supabase
        .from("profiles")
        .select("latitude, longitude")
        .eq("email", user.email)
        .single();

      if (!data?.latitude || !data?.longitude) {
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
                      setView(user.role === "ngo" ? "available-food" : "add-food")
                    }
                    className="bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700"
                  >
                    {user.role === "ngo"
                      ? "Browse Available Food"
                      : "Add Donation"}
                  </button>
                </div>
              </div>
            )
          )}

          {view === "ngo-location" && <NGOProfileLocation />}
          {view === "add-food" && <AddFoodForm />}
          {view === "my-donations" && <MyDonations />}
          {view === "available-food" && <AvailableDonations />}
          {view === "all-donations" && <FoodGrid viewType={view} />}
          {view === "profile" && <ProfileSettings />}

        </main>
      </div>
    </div>
  );
};


/* ---------------- Root App ---------------- */

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
