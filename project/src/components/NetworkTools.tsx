import React, { useState } from 'react';
import { Wifi, Search, AlertCircle, CheckCircle, XCircle, Activity } from 'lucide-react';

const NetworkTools: React.FC = () => {
  const [scanTarget, setScanTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [ipInput, setIpInput] = useState('');
  const [ipInfo, setIpInfo] = useState<any>(null);

  const commonPorts = [
    { port: 21, service: 'FTP', risk: 'medium' },
    { port: 22, service: 'SSH', risk: 'low' },
    { port: 23, service: 'Telnet', risk: 'high' },
    { port: 25, service: 'SMTP', risk: 'medium' },
    { port: 53, service: 'DNS', risk: 'low' },
    { port: 80, service: 'HTTP', risk: 'low' },
    { port: 110, service: 'POP3', risk: 'medium' },
    { port: 143, service: 'IMAP', risk: 'medium' },
    { port: 443, service: 'HTTPS', risk: 'low' },
    { port: 993, service: 'IMAPS', risk: 'low' },
    { port: 995, service: 'POP3S', risk: 'low' },
    { port: 3306, service: 'MySQL', risk: 'high' },
    { port: 3389, service: 'RDP', risk: 'high' },
    { port: 5432, service: 'PostgreSQL', risk: 'high' },
  ];

  const simulatePortScan = () => {
    if (!scanTarget) return;
    
    setScanning(true);
    setScanResults([]);
    
    // Simulate scanning process
    setTimeout(() => {
      const results = commonPorts.map(portInfo => ({
        ...portInfo,
        status: Math.random() > 0.7 ? 'open' : 'closed',
        responseTime: Math.floor(Math.random() * 100) + 'ms'
      }));
      
      setScanResults(results);
      setScanning(false);
    }, 3000);
  };

  const analyzeIP = () => {
    if (!ipInput) return;
    
    // Simulate IP analysis (in a real app, you'd use a geolocation API)
    const mockInfo = {
      ip: ipInput,
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      isp: 'Example ISP',
      organization: 'Example Org',
      timezone: 'America/Los_Angeles',
      threat_level: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
    };
    
    setIpInfo(mockInfo);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-900/20 border-green-500/30';
      case 'medium': return 'bg-yellow-900/20 border-yellow-500/30';
      case 'high': return 'bg-red-900/20 border-red-500/30';
      default: return 'bg-gray-900/20 border-gray-500/30';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Network Security Tools</h2>
        <p className="text-gray-400">Port scanning and network analysis utilities</p>
      </div>

      <div className="space-y-8">
        {/* Port Scanner */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Search className="h-5 w-5 text-cyan-400 mr-2" />
            Port Scanner (Simulation)
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Target Host</label>
                <input
                  type="text"
                  value={scanTarget}
                  onChange={(e) => setScanTarget(e.target.value)}
                  placeholder="Enter IP address or hostname"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <button
                onClick={simulatePortScan}
                disabled={scanning || !scanTarget}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {scanning ? (
                  <>
                    <Activity className="h-4 w-4 animate-spin" />
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Start Scan</span>
                  </>
                )}
              </button>
              
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium">Educational Purpose</p>
                    <p>This is a simulation tool for learning. Only scan systems you own or have permission to test.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-300 mb-4">Scan Results</h4>
              {scanResults.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {scanResults.map((result, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getRiskBg(result.risk)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {result.status === 'open' ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-500" />
                          )}
                          <div>
                            <span className="text-white font-medium">Port {result.port}</span>
                            <span className="text-gray-400 text-sm ml-2">({result.service})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getRiskColor(result.risk)}`}>
                            {result.risk.toUpperCase()}
                          </div>
                          <div className="text-gray-400 text-xs">{result.responseTime}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : scanning ? (
                <div className="text-center py-12">
                  <Activity className="h-8 w-8 text-cyan-400 animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Scanning ports...</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Search className="h-8 w-8 mx-auto mb-4" />
                  <p>Start a scan to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IP Analysis */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Wifi className="h-5 w-5 text-green-400 mr-2" />
            IP Address Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">IP Address</label>
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="Enter IP address (e.g., 8.8.8.8)"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              
              <button
                onClick={analyzeIP}
                disabled={!ipInput}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Analyze IP
              </button>
            </div>
            
            <div>
              {ipInfo ? (
                <div className="space-y-4">
                  <h4 className="text-gray-300 font-medium">Analysis Results</h4>
                  <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">IP Address:</span>
                      <span className="text-white font-mono">{ipInfo.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span className="text-white">{ipInfo.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Region:</span>
                      <span className="text-white">{ipInfo.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">City:</span>
                      <span className="text-white">{ipInfo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ISP:</span>
                      <span className="text-white">{ipInfo.isp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timezone:</span>
                      <span className="text-white">{ipInfo.timezone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Threat Level:</span>
                      <span className={`font-medium ${getRiskColor(ipInfo.threat_level)}`}>
                        {ipInfo.threat_level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Wifi className="h-8 w-8 mx-auto mb-4" />
                  <p>Enter an IP address to analyze</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkTools;