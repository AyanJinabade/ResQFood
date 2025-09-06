import React, { useState } from 'react';
import { FileCheck, CheckCircle, XCircle, AlertTriangle, Shield, User, Database, Network } from 'lucide-react';

const SecurityAudit: React.FC = () => {
  const [auditResults, setAuditResults] = useState<any>({});
  const [scanning, setScanning] = useState(false);

  const auditCategories = [
    {
      id: 'passwords',
      name: 'Password Security',
      icon: Shield,
      checks: [
        { id: 'length', name: 'Password minimum length (8+ chars)', status: 'pass' },
        { id: 'complexity', name: 'Password complexity requirements', status: 'pass' },
        { id: 'history', name: 'Password history enforcement', status: 'warning' },
        { id: 'expiry', name: 'Password expiration policy', status: 'fail' },
        { id: 'lockout', name: 'Account lockout after failed attempts', status: 'pass' },
      ]
    },
    {
      id: 'access',
      name: 'Access Control',
      icon: User,
      checks: [
        { id: 'mfa', name: 'Multi-factor authentication enabled', status: 'pass' },
        { id: 'rbac', name: 'Role-based access control', status: 'pass' },
        { id: 'privileged', name: 'Privileged account monitoring', status: 'warning' },
        { id: 'sessions', name: 'Session timeout configuration', status: 'pass' },
        { id: 'review', name: 'Regular access reviews', status: 'fail' },
      ]
    },
    {
      id: 'network',
      name: 'Network Security',
      icon: Network,
      checks: [
        { id: 'firewall', name: 'Firewall properly configured', status: 'pass' },
        { id: 'segmentation', name: 'Network segmentation', status: 'pass' },
        { id: 'monitoring', name: 'Network traffic monitoring', status: 'warning' },
        { id: 'wireless', name: 'Wireless security (WPA3)', status: 'pass' },
        { id: 'vpn', name: 'VPN for remote access', status: 'pass' },
      ]
    },
    {
      id: 'data',
      name: 'Data Protection',
      icon: Database,
      checks: [
        { id: 'encryption', name: 'Data encryption at rest', status: 'pass' },
        { id: 'transit', name: 'Data encryption in transit', status: 'pass' },
        { id: 'backup', name: 'Regular data backups', status: 'warning' },
        { id: 'retention', name: 'Data retention policies', status: 'pass' },
        { id: 'classification', name: 'Data classification scheme', status: 'fail' },
      ]
    }
  ];

  const runSecurityAudit = () => {
    setScanning(true);
    
    // Simulate audit process
    setTimeout(() => {
      const results = auditCategories.reduce((acc, category) => {
        acc[category.id] = {
          ...category,
          score: calculateCategoryScore(category.checks),
          timestamp: new Date().toISOString()
        };
        return acc;
      }, {} as any);
      
      setAuditResults(results);
      setScanning(false);
    }, 3000);
  };

  const calculateCategoryScore = (checks: any[]) => {
    const passed = checks.filter(check => check.status === 'pass').length;
    return Math.round((passed / checks.length) * 100);
  };

  const getOverallScore = () => {
    if (Object.keys(auditResults).length === 0) return 0;
    const scores = Object.values(auditResults).map((category: any) => category.score);
    return Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'fail': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Security Audit</h2>
        <p className="text-gray-400">Comprehensive security posture assessment</p>
      </div>

      {/* Audit Controls */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Security Assessment</h3>
            <p className="text-gray-400">Run a comprehensive security audit to identify potential vulnerabilities</p>
          </div>
          <button
            onClick={runSecurityAudit}
            disabled={scanning}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {scanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4" />
                <span>Run Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overall Score */}
      {Object.keys(auditResults).length > 0 && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Overall Security Score</h3>
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#374151"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#06B6D4"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${getOverallScore() * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{getOverallScore()}%</span>
              </div>
            </div>
            <p className="text-gray-400 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Audit Results */}
      {Object.keys(auditResults).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.values(auditResults).map((category: any) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Icon className="h-5 w-5 text-cyan-400 mr-2" />
                    {category.name}
                  </h3>
                  <span className="text-lg font-bold text-cyan-400">{category.score}%</span>
                </div>
                
                <div className="space-y-3">
                  {category.checks.map((check: any) => (
                    <div key={check.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.status)}
                        <span className="text-gray-300 text-sm">{check.name}</span>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Placeholder when no audit results */}
      {Object.keys(auditResults).length === 0 && !scanning && (
        <div className="text-center py-12">
          <FileCheck className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Audit Results</h3>
          <p className="text-gray-500">Click "Run Audit" to perform a security assessment</p>
        </div>
      )}
    </div>
  );
};

export default SecurityAudit;