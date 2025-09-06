import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Copy, Check, AlertCircle, Shield } from 'lucide-react';

const PasswordTools: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const analyzePassword = (pwd: string) => {
    let score = 0;
    let feedback = [];

    if (pwd.length >= 8) score += 1;
    else feedback.push('Use at least 8 characters');

    if (pwd.length >= 12) score += 1;
    else feedback.push('Consider using 12+ characters');

    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(pwd)) score += 1;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 1;
    else feedback.push('Include special characters');

    const strength = score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong';
    const color = score <= 2 ? 'text-red-400' : score <= 4 ? 'text-yellow-400' : 'text-green-400';
    const bgColor = score <= 2 ? 'bg-red-400' : score <= 4 ? 'bg-yellow-400' : 'bg-green-400';

    return { score, strength, color, bgColor, feedback };
  };

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(newPassword);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  }, [passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const analysis = analyzePassword(password);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Password Security Tools</h2>
        <p className="text-gray-400">Analyze password strength and generate secure passwords</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Password Analyzer */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 text-cyan-400 mr-2" />
            Password Strength Analyzer
          </h3>
          
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to analyze"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 pr-12"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {password && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Strength:</span>
                  <span className={`font-semibold ${analysis.color}`}>{analysis.strength}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${analysis.bgColor} transition-all duration-300`}
                    style={{ width: `${(analysis.score / 6) * 100}%` }}
                  ></div>
                </div>
              </div>

              {analysis.feedback.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Recommendations
                  </h4>
                  <ul className="text-yellow-200 text-sm space-y-1">
                    {analysis.feedback.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Password Generator */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <RefreshCw className="h-5 w-5 text-green-400 mr-2" />
            Secure Password Generator
          </h3>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Password Length: {passwordLength}</label>
            <input
              type="range"
              min="8"
              max="64"
              value={passwordLength}
              onChange={(e) => setPasswordLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <span className="text-gray-300">Uppercase</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <span className="text-gray-300">Lowercase</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <span className="text-gray-300">Numbers</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
              />
              <span className="text-gray-300">Symbols</span>
            </label>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={generatedPassword}
              readOnly
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white pr-12 font-mono"
            />
            <button
              onClick={() => copyToClipboard(generatedPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>

          <button
            onClick={generatePassword}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Generate New Password</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordTools;