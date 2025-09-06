import { useState } from 'react';
import { Shield, Lock, BookOpen, Home, Hash, Wifi, FileCheck } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PasswordTools from './components/PasswordTools';
import CryptoTools from './components/CryptoTools';
import NetworkTools from './components/NetworkTools';
import SecurityAudit from './components/SecurityAudit';
import Resources from './components/Resources';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'passwords', name: 'Password Tools', icon: Lock },
  { id: 'crypto', name: 'Cryptography', icon: Hash },
  { id: 'network', name: 'Network Tools', icon: Wifi },
  { id: 'audit', name: 'Security Audit', icon: FileCheck },
  { id: 'resources', name: 'Resources', icon: BookOpen },
];

function App() {
  
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'passwords':
        return <PasswordTools />;
      case 'crypto':
        return <CryptoTools />;
      case 'network':
        return <NetworkTools />;
      case 'audit':
        return <SecurityAudit />;
      case 'resources':
        return <Resources />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                CyberSec Pro
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">System Secure</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          activeTab === item.id
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700/50 min-h-[600px]">
              {renderActiveComponent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;