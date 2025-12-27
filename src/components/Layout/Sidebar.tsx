import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Plus, 
  History, 
  MapPin, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings,
  UtensilsCrossed,
  Building2,
  Heart,
  Shield,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  const { user, profile } = useAuth();

  if (!user || !profile) return null;

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    switch (profile.role) {
      case 'restaurant':
      case 'society':
        return [
          ...baseItems,
          { id: 'add-food', label: 'Add Food', icon: Plus },
          { id: 'my-donations', label: 'My Donations', icon: UtensilsCrossed },
          { id: 'history', label: 'History', icon: History },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          { id: 'chat-support', label: 'Chat Support', icon: MessageCircle },
          { id: 'profile', label: 'Profile', icon: Settings },
        ];

      case 'ngo':
        return [
          ...baseItems,
          { id: 'available-food', label: 'Available Food', icon: MapPin },
          { id: 'my-requests', label: 'My Requests', icon: Heart },
          { id: 'history', label: 'Collection History', icon: History },
          { id: 'feedback', label: 'Feedback', icon: MessageSquare },
          { id: 'chat-support', label: 'Chat Support', icon: MessageCircle },
          { id: 'profile', label: 'Profile', icon: Settings },
        ];

      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'Manage Users', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'all-donations', label: 'All Donations', icon: UtensilsCrossed },
          { id: 'feedback', label: 'Feedback Review', icon: MessageSquare },
          { id: 'chat-support', label: 'Chat Support', icon: MessageCircle },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'restaurant': return UtensilsCrossed;
      case 'society': return Building2;
      case 'ngo': return Heart;
      case 'admin': return Shield;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(profile.role);

  return (
    <aside className="bg-white border-r border-gray-200 w-64 min-h-screen">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <RoleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 truncate">{profile.name}</h3>
            <p className="text-sm text-green-600 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 mt-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Impact Today</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Meals Saved:</span>
              <span className="font-medium text-green-800">127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">People Fed:</span>
              <span className="font-medium text-green-800">89</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;