import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Heart,
  MessageCircle,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth, supabase } from "../../context/AuthContext";

type Notification = {
  id: string;
  title: string | null;
  message: string | null;
  is_read: boolean | null;
  created_at: string | null;
};

const Header = () => {
  const { user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] =
    useState(false);

  const [isNotificationOpen, setIsNotificationOpen] =
    useState(false);

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "restaurant":
        return "text-blue-600";
      case "society":
        return "text-purple-600";
      case "ngo":
        return "text-green-600";
      case "admin":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  async function fetchNotifications() {
    if (!user?.email) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!profile?.id) return;

    const { data } = await supabase
      .from("notifications")
      .select(`
        id,
        title,
        message,
        is_read,
        created_at
      `)
      .eq("user_id", profile.id)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data || []);
  }

  async function markAsRead(id: string) {
    await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);

    fetchNotifications();
  }

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel("notifications_live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user]);

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ResQFood
                </h1>

                <p className="text-xs text-gray-500 -mt-1">
                  Rescue • Share • Nourish
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-green-600"
            >
              Home
            </a>

            <a
              href="#about"
              className="text-gray-700 hover:text-green-600"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-gray-700 hover:text-green-600"
            >
              Contact
            </a>

            <Link
              to="/chat"
              className="flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with us
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationOpen(
                      !isNotificationOpen
                    )
                  }
                  className="relative p-2 rounded-lg hover:bg-gray-100"
                >
                  <Bell className="w-6 h-6 text-gray-700" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b font-semibold">
                      Notifications
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() =>
                            markAsRead(n.id)
                          }
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            !n.is_read
                              ? "bg-green-50"
                              : ""
                          }`}
                        >
                          <p className="font-semibold">
                            {n.title}
                          </p>

                          <p className="text-sm text-gray-600">
                            {n.message}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {n.created_at}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileMenuOpen(
                      !isProfileMenuOpen
                    )
                  }
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">
                      {user.name}
                    </p>

                    <p
                      className={`text-xs capitalize ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </p>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <a
                      href="#profile"
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </a>

                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile Menu */}
            <button
              onClick={() =>
                setIsMobileMenuOpen(
                  !isMobileMenuOpen
                )
              }
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;