import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Menu, X, User, LogOut, Settings, Heart, MessageCircle } from 'lucide-react';

const Header = () => {
  const { user, profile, logout } = useAuth();
  const { unreadCount } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'restaurant': return 'text-blue-600';
      case 'society': return 'text-purple-600';
      case 'ngo': return 'text-green-600';
      case 'admin': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

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
                <h1 className="text-xl font-bold text-gray-900">ResQFood</h1>
                <p className="text-xs text-gray-500 -mt-1">Rescue • Share • Nourish</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* User Profile / Auth */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {user && (
              <button
                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                title="Notifications"
              >
                <MessageCircle className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{profile?.name || user.email}</p>
                    <p className={`text-xs capitalize ${getRoleColor(profile?.role || 'restaurant')}`}>
                      {profile?.role || 'User'}
                    </p>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <a
                      href="#profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </a>
                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button className="text-gray-700 hover:text-green-600 transition-colors">
                  Login
                </button>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                  Join Us
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;