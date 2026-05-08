// FILE: src/components/Layout/Sidebar.tsx

import {
  Home,
  PlusCircle,
  ClipboardList,
  User,
  MapPin,
  LogOut,
  Bell,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
}: SidebarProps) {
  const { user, logout } = useAuth();

  const link = (
    view: string,
    label: string,
    icon: JSX.Element
  ) => (
    <button
      onClick={() => onViewChange(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === view
          ? "bg-green-100 text-green-700 font-semibold shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col justify-between shadow-sm">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <h1 className="text-2xl font-bold text-green-600 mb-8">
          ResQFood
        </h1>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Dashboard */}
          {link(
            "dashboard",
            "Dashboard",
            <Home size={18} />
          )}

          {/* Restaurant Side */}
          {user?.role === "restaurant" && (
            <>
              {link(
                "add-food",
                "Add Donation",
                <PlusCircle size={18} />
              )}

              {link(
                "my-donations",
                "My Donations",
                <ClipboardList size={18} />
              )}

              {link(
                "notifications",
                "Restaurant Notifications",
                <Bell size={18} />
              )}
            </>
          )}

          {/* NGO Side */}
          {user?.role === "ngo" && (
            <>
              {link(
                "available-food",
                "Available Food",
                <ClipboardList size={18} />
              )}

              {link(
                "ngo-location",
                "Set My Location",
                <MapPin size={18} />
              )}

              {link(
                "notifications",
                "NGO Notifications",
                <Bell size={18} />
              )}
            </>
          )}

          {/* Admin Side */}
          {user?.role === "admin" && (
            <>
              {link(
                "all-donations",
                "All Donations",
                <ClipboardList size={18} />
              )}

              {link(
                "notifications",
                "System Notifications",
                <Bell size={18} />
              )}
            </>
          )}

          {/* Common Profile */}
          {link(
            "profile",
            "Profile Settings",
            <User size={18} />
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-6 border-t">
        {/* Logged-in User Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Logged in as
          </p>

          <p className="font-medium text-gray-800">
            {user?.full_name || "User"}
          </p>

          <p className="text-xs text-gray-500 capitalize">
            {user?.role || "member"}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}