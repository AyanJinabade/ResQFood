import React, { useState } from 'react';
import { Hash, Lock, Unlock, Copy, Check, Key } from 'lucide-react';

const CryptoTools: React.FC = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashType, setHashType] = useState('sha256');
  const [hashResult, setHashResult] = useState('');
  const [encryptInput, setEncryptInput] = useState('');
  const [encryptKey, setEncryptKey] = useState('');
  const [encryptResult, setEncryptResult] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptResult, setDecryptResult] = useState('');
  const [copied, setCopied] = useState('');

  const generateHash = async () => {
    if (!hashInput) return;
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      
      let hashBuffer;
      switch (hashType) {
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha384':
          hashBuffer = await crypto.subtle.digest('SHA-384', data);
          break;
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
      }
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setHashResult(hashHex);
    } catch (error) {
      console.error('Hashing error:', error);
      setHashResult('Error generating hash');
    }
  };

  // Simple Caesar cipher for demonstration
  const caesarEncrypt = (text: string, key: string): string => {
    const shift = parseInt(key) || 1;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
    });
  };

  const caesarDecrypt = (text: string, key: string): string => {
    const shift = parseInt(key) || 1;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start - shift + 26) % 26) + start);
    });
  };

  const performEncrypt = () => {
    if (!encryptInput || !encryptKey) return;
    const result = caesarEncrypt(encryptInput, encryptKey);
    setEncryptResult(result);
  };

  const performDecrypt = () => {
    if (!decryptInput || !decryptKey) return;
    const result = caesarDecrypt(decryptInput, decryptKey);
    setDecryptResult(result);
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Cryptography Tools</h2>
        <p className="text-gray-400">Hash generation and basic encryption/decryption utilities</p>
      </div>

      <div className="space-y-8">
        {/* Hash Generator */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Hash className="h-5 w-5 text-purple-400 mr-2" />
            Hash Generator
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Input Text</label>
                <textarea
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Enter text to hash"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Hash Type</label>
                <select
                  value={hashType}
                  onChange={(e) => setHashType(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="sha1">SHA-1</option>
                  <option value="sha256">SHA-256</option>
                  <option value="sha384">SHA-384</option>
                  <option value="sha512">SHA-512</option>
                </select>
              </div>
              
              <button
                onClick={generateHash}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Generate Hash
              </button>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Hash Result</label>
              <div className="relative">
                <textarea
                  value={hashResult}
                  readOnly
                  placeholder="Hash will appear here"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono resize-none"
                  rows={6}
                />
                {hashResult && (
                  <button
                    onClick={() => copyToClipboard(hashResult, 'hash')}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  >
                    {copied === 'hash' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Encryption/Decryption */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Encrypt */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Lock className="h-5 w-5 text-green-400 mr-2" />
              Encrypt Text
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Plain Text</label>
                <textarea
                  value={encryptInput}
                  onChange={(e) => setEncryptInput(e.target.value)}
                  placeholder="Enter text to encrypt"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Encryption Key (Shift Value)</label>
                <input
                  type="number"
                  value={encryptKey}
                  onChange={(e) => setEncryptKey(e.target.value)}
                  placeholder="Enter shift value (1-25)"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  min="1"
                  max="25"
                />
              </div>
              
              <button
                onClick={performEncrypt}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Encrypt
              </button>
              
              <div className="relative">
                <textarea
                  value={encryptResult}
                  readOnly
                  placeholder="Encrypted text will appear here"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono resize-none"
                  rows={4}
                />
                {encryptResult && (
                  <button
                    onClick={() => copyToClipboard(encryptResult, 'encrypt')}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  >
                    {copied === 'encrypt' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Decrypt */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Unlock className="h-5 w-5 text-blue-400 mr-2" />
              Decrypt Text
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Encrypted Text</label>
                <textarea
                  value={decryptInput}
                  onChange={(e) => setDecryptInput(e.target.value)}
                  placeholder="Enter text to decrypt"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Decryption Key (Shift Value)</label>
                <input
                  type="number"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  placeholder="Enter shift value (1-25)"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  min="1"
                  max="25"
                />
              </div>
              
              <button
                onClick={performDecrypt}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
              >
                Decrypt
              </button>
              
              <div className="relative">
                <textarea
                  value={decryptResult}
                  readOnly
                  placeholder="Decrypted text will appear here"
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono resize-none"
                  rows={4}
                />
                {decryptResult && (
                  <button
                    onClick={() => copyToClipboard(decryptResult, 'decrypt')}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                  >
                    {copied === 'decrypt' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTools;