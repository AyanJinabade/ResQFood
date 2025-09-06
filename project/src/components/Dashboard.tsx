import React from 'react';
import { Shield, Lock, AlertTriangle, CheckCircle, Activity, Zap, Globe, Server } from 'lucide-react';

const Dashboard: React.FC = () => {
  const securityMetrics = [
    { label: 'Security Score', value: '94%', color: 'text-green-400', icon: Shield },
    { label: 'Active Threats', value: '0', color: 'text-green-400', icon: AlertTriangle },
    { label: 'Protected Assets', value: '127', color: 'text-cyan-400', icon: Lock },
    { label: 'Last Scan', value: '2 min ago', color: 'text-gray-300', icon: Activity },
  ];

  const recentActivity = [
    { action: 'Password strength check completed', time: '2 minutes ago', status: 'success' },
    { action: 'Hash verification successful', time: '15 minutes ago', status: 'success' },
    { action: 'Network scan initiated', time: '1 hour ago', status: 'info' },
    { action: 'Security audit updated', time: '3 hours ago', status: 'warning' },
  ];

  const threatIntel = [
    { type: 'Phishing', level: 'Low', count: 3, trend: 'down' },
    { type: 'Malware', level: 'Medium', count: 12, trend: 'stable' },
    { type: 'DDoS', level: 'Low', count: 1, trend: 'down' },
    { type: 'Brute Force', level: 'High', count: 45, trend: 'up' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Security Dashboard</h2>
        <p className="text-gray-400">Real-time overview of your security posture</p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color} mt-1`}>{metric.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${metric.color} opacity-80`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 text-cyan-400 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-green-400' : 
                  activity.status === 'warning' ? 'bg-yellow-400' : 'bg-cyan-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.action}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Intelligence */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Globe className="h-5 w-5 text-red-400 mr-2" />
            Threat Intelligence
          </h3>
          <div className="space-y-4">
            {threatIntel.map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    threat.level === 'Low' ? 'bg-green-400' : 
                    threat.level === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{threat.type}</p>
                    <p className="text-gray-400 text-sm">{threat.level} Risk</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{threat.count}</p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-1 h-1 rounded-full ${
                      threat.trend === 'up' ? 'bg-red-400' : 
                      threat.trend === 'down' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs text-gray-400">{threat.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Server className="h-5 w-5 text-green-400 mr-2" />
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <span className="text-white font-medium">Firewall</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <span className="text-white font-medium">Antivirus</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">Protected</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <span className="text-white font-medium">VPN</span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;