import { useState } from 'react';
import { Heart, Users, Utensils, MapPin, Star, ChevronRight, Play } from 'lucide-react';
import AuthModal from '../Auth/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const stats = [
    { value: '2,847', label: 'People Fed', icon: Heart },
    { value: '156', label: 'Active Partners', icon: Users },
    { value: '1,245', label: 'Meals Rescued', icon: Utensils },
    { value: '23', label: 'Cities Served', icon: MapPin },
  ];



  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20 pb-32 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%2334d399\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {/* BADGE */}
                <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-green-700">Live Impact Tracking</span>
                </div>

                {/* HEADING */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Rescue Food,
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      Nourish Lives
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Connect restaurants, societies, and NGOs to eliminate food waste while feeding those in need.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => openAuth('register')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center group shadow-lg"
                  >
                    Start Saving Food
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => openAuth('login')}
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-green-300 hover:text-green-600 transition-colors flex items-center justify-center group"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mb-2">
                          <Icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD / IMAGE */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500 space-y-6">
                  {/* Example Stats */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Food Rescued Today</h3>
                      <p className="text-green-600 font-bold text-xl">127 meals</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🍽️</div>
                      <div className="font-semibold">45 Meals</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold">12 NGOs</div>
                      <div className="text-sm text-gray-600">Nearby</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium">Freshness Score</div>
                        <div className="text-sm text-gray-600">AI Quality Check</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ... You can keep the rest of your sections as they are ... */}

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authMode}
        />
      </div>
    </>
  );
};

export default LandingPage;
