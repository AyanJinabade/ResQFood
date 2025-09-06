import React from 'react';
import { BookOpen, ExternalLink, AlertTriangle, Shield, Lock, Zap } from 'lucide-react';

const Resources: React.FC = () => {
  const securityNews = [
    {
      title: 'New Zero-Day Vulnerability Discovered in Popular Framework',
      source: 'CyberSec News',
      time: '2 hours ago',
      severity: 'high',
      category: 'vulnerability'
    },
    {
      title: 'Best Practices for Implementing Zero Trust Architecture',
      source: 'Security Weekly',
      time: '6 hours ago',
      severity: 'info',
      category: 'best-practices'
    },
    {
      title: 'Phishing Attacks Increase by 40% This Quarter',
      source: 'Threat Intel',
      time: '12 hours ago',
      severity: 'medium',
      category: 'threat-intel'
    },
    {
      title: 'New Encryption Standards Released by NIST',
      source: 'NIST Updates',
      time: '1 day ago',
      severity: 'info',
      category: 'standards'
    }
  ];

  const bestPractices = [
    {
      title: 'Password Security',
      icon: Lock,
      tips: [
        'Use unique passwords for each account',
        'Enable multi-factor authentication',
        'Use a password manager',
        'Regularly update passwords'
      ]
    },
    {
      title: 'Network Security',
      icon: Shield,
      tips: [
        'Keep software and systems updated',
        'Use VPN for remote connections',
        'Implement network segmentation',
        'Monitor network traffic regularly'
      ]
    },
    {
      title: 'Data Protection',
      icon: Lock,
      tips: [
        'Encrypt sensitive data',
        'Implement regular backups',
        'Use secure file transfer protocols',
        'Apply principle of least privilege'
      ]
    },
    {
      title: 'Incident Response',
      icon: Zap,
      tips: [
        'Have an incident response plan',
        'Regularly test your procedures',
        'Maintain contact information',
        'Document all incidents'
      ]
    }
  ];

  const learningResources = [
    {
      title: 'OWASP Top 10',
      description: 'The most critical web application security risks',
      url: '#',
      category: 'Web Security'
    },
    {
      title: 'NIST Cybersecurity Framework',
      description: 'Framework for improving critical infrastructure cybersecurity',
      url: '#',
      category: 'Standards'
    },
    {
      title: 'CVE Database',
      description: 'Common Vulnerabilities and Exposures database',
      url: '#',
      category: 'Vulnerabilities'
    },
    {
      title: 'Security Headers',
      description: 'Learn about HTTP security headers',
      url: '#',
      category: 'Web Security'
    },
    {
      title: 'Penetration Testing Guide',
      description: 'Comprehensive guide to ethical hacking',
      url: '#',
      category: 'Testing'
    },
    {
      title: 'Cryptography Basics',
      description: 'Understanding modern cryptographic principles',
      url: '#',
      category: 'Cryptography'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'info': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vulnerability': return <AlertTriangle className="h-4 w-4" />;
      case 'best-practices': return <Shield className="h-4 w-4" />;
      case 'threat-intel': return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Security Resources</h2>
        <p className="text-gray-400">Latest security news, best practices, and learning materials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security News */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              Latest Security News
            </h3>
            
            <div className="space-y-4">
              {securityNews.map((news, index) => (
                <div key={index} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/50 hover:bg-gray-900/50 transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium flex-1 mr-4">{news.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(news.severity)}`}>
                      {news.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      {getCategoryIcon(news.category)}
                      <span>{news.source}</span>
                    </div>
                    <span className="text-gray-500">{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Resources */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-green-400 mr-2" />
              Learning Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningResources.map((resource, index) => (
                <div key={index} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/50 hover:bg-gray-900/50 transition-all duration-200 group">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors">{resource.title}</h4>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{resource.description}</p>
                  <span className="text-xs text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded">{resource.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Best Practices */}
        <div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 text-cyan-400 mr-2" />
              Security Best Practices
            </h3>
            
            <div className="space-y-6">
              {bestPractices.map((practice, index) => {
                const Icon = practice.icon;
                return (
                  <div key={index} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Icon className="h-4 w-4 text-cyan-400 mr-2" />
                      {practice.title}
                    </h4>
                    <ul className="space-y-2">
                      {practice.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-gray-400 text-sm flex items-start">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Security Tip of the Day</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Always keep your software updated. Most security breaches exploit known vulnerabilities that have already been patched. Enable automatic updates where possible, and regularly check for updates to your critical applications and operating systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;