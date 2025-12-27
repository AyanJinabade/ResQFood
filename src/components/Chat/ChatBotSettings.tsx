import { useState } from 'react';
import { useChatBot } from './ChatBotProvider';
import {
  Settings,
  Bell,
  Globe,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
} from 'lucide-react';

const ChatBotSettings = () => {
  const { isEnabled, toggleChatBot, sessions } = useChatBot();

  // Define the SettingsType interface
  interface SettingsType {
    enabled: boolean;
    notifications: boolean;
    language: string;
    autoConnect: boolean;
    soundEnabled: boolean;
    theme: string;
    welcomeMessageShown: boolean;
  }

  // Initialize state with default settings
  const [settings, setSettings] = useState<SettingsType>({
    enabled: isEnabled,
    notifications: true,
    language: 'en',
    autoConnect: false,
    soundEnabled: true,
    theme: 'light',
    welcomeMessageShown: true,
  });
  const [showSaved, setShowSaved] = useState(false);

  // Update settings and save to localStorage
  const updateSettings = (newSettings: Partial<SettingsType>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    localStorage.setItem(
      'resqfood_chat_settings',
      JSON.stringify({ ...settings, ...newSettings })
    );
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Toggle settings and handle chatbot enable/disable
  const handleToggle = (key: keyof SettingsType) => {
    updateSettings({ [key]: !settings[key] });
    if (key === 'enabled') {
      toggleChatBot();
    }
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
  };

  // Handle save settings
  const handleSave = () => {
    localStorage.setItem('resqfood_chat_settings', JSON.stringify(settings));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  // Handle reset to default settings
  const handleReset = () => {
  const defaultSettings = {
    enabled: true,
    notifications: true,
    language: 'en',
    autoConnect: false,
    soundEnabled: true,
    theme: 'light',
    welcomeMessageShown: true,
  };

  setSettings(defaultSettings);
  localStorage.setItem('resqfood_chat_settings', JSON.stringify(defaultSettings));
  setShowSaved(true);
  setTimeout(() => setShowSaved(false), 2000);
};


  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ar', name: 'العربية' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">ChatBot Settings</h2>
          <p className="text-gray-600">Customize your ResQBot experience</p>
        </div>
      </div>

      {showSaved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✅ Settings saved successfully!
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Enable/Disable ChatBot */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Enable ChatBot</h3>
            <p className="text-sm text-gray-600">Turn ResQBot on or off</p>
          </div>
          <button
            onClick={() => handleToggle('enabled')}
            className={`p-1 rounded-full transition-colors ${
              settings.enabled ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.enabled ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Get notified of new messages</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('notifications')}
            className={`p-1 rounded-full transition-colors ${
              settings.notifications ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.notifications ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Auto-Connect to Live Support */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Auto-Connect to Live Support</h3>
            <p className="text-sm text-gray-600">
              Automatically connect to human agents for complex issues
            </p>
          </div>
          <button
            onClick={() => handleToggle('autoConnect')}
            className={`p-1 rounded-full transition-colors ${
              settings.autoConnect ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.autoConnect ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Sound Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Sound Notifications</h3>
            <p className="text-sm text-gray-600">Play sound for new messages</p>
          </div>
          <button
            onClick={() => handleToggle('soundEnabled')}
            className={`p-1 rounded-full transition-colors ${
              settings.soundEnabled ? 'text-green-600' : 'text-gray-400'
            }`}
          >
            {settings.soundEnabled ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Language Selection */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">Language</h3>
              <p className="text-sm text-gray-600">Choose your preferred language</p>
            </div>
          </div>
          <select
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chat History */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Support History</h3>
          <p className="text-sm text-gray-600 mb-3">
            You have {sessions.length} support sessions. History is stored locally and secure.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                localStorage.removeItem('resqfood_chat_history');
                alert('Chat history cleared successfully!');
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Clear All Chat History
            </button>
            <button
              onClick={() => {
                const history = JSON.stringify(sessions, null, 2);
                const blob = new Blob([history], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resqfood-support-history.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            >
              Export Support History
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => updateSettings({ welcomeMessageShown: false })}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded transition-colors"
            >
              Reset Welcome Message
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('resqfood_chatbot_preferences');
                alert('Preferences reset successfully!');
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded transition-colors"
            >
              Reset Chat Preferences
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotSettings;