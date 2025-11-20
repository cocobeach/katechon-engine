import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Settings as SettingsIcon, Save, X } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { ollamaUrl, ollamaModel, stripePublicKey, updateSettings } = useStore();
  
  const [localSettings, setLocalSettings] = useState({
    ollamaUrl,
    ollamaModel,
    stripePublicKey,
  });

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-amber-500 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <SettingsIcon className="text-amber-400" size={24} />
            <h2 className="text-2xl font-bold text-amber-400">Admin Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-amber-500/20 rounded transition-colors"
          >
            <X className="text-amber-400" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ollama Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 border-b border-amber-500/30 pb-2">
              Ollama Configuration
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ollama API URL
              </label>
              <input
                type="text"
                value={localSettings.ollamaUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, ollamaUrl: e.target.value })}
                placeholder="http://127.0.0.1:11434"
                className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 rounded text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Default: http://127.0.0.1:11434 (local Ollama instance)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Default Model
              </label>
              <input
                type="text"
                value={localSettings.ollamaModel}
                onChange={(e) => setLocalSettings({ ...localSettings, ollamaModel: e.target.value })}
                placeholder="llama2"
                className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 rounded text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Examples: llama2, llama3, mistral, mixtral, phi3, etc.
              </p>
            </div>
          </div>

          {/* Stripe Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 border-b border-amber-500/30 pb-2">
              Stripe Payment Configuration
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stripe Publishable Key
              </label>
              <input
                type="text"
                value={localSettings.stripePublicKey}
                onChange={(e) => setLocalSettings({ ...localSettings, stripePublicKey: e.target.value })}
                placeholder="pk_test_..."
                className="w-full px-4 py-2 bg-black/50 border border-amber-500/30 rounded text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your Stripe publishable key (starts with pk_test_ or pk_live_)
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded p-4">
              <h4 className="text-sm font-semibold text-amber-400 mb-2">Payment Integration Notes</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• This is a free MVP version - payments will be enabled in future releases</li>
                <li>• Configure your Stripe account at <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">stripe.com</a></li>
                <li>• Use test keys during development (pk_test_...)</li>
                <li>• Switch to live keys only when ready for production</li>
              </ul>
            </div>
          </div>

          {/* Application Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 border-b border-amber-500/30 pb-2">
              Application Information
            </h3>
            
            <div className="bg-black/50 border border-amber-500/30 rounded p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version:</span>
                <span className="text-white">1.0.0 (MVP)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Platform:</span>
                <span className="text-white">Tauri + React + Rust</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">License:</span>
                <span className="text-white">Free (MVP Testing)</span>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 border-b border-amber-500/30 pb-2">
              System Requirements
            </h3>
            
            <div className="bg-black/50 border border-amber-500/30 rounded p-4">
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Windows 11 (recommended) or Windows 10</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Ollama running locally (download from ollama.ai)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>At least one LLM model pulled (e.g., ollama pull llama2)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>8GB RAM minimum (16GB recommended for larger models)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">✓</span>
                  <span>Internet connection for RSS feeds and updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-amber-500/30">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-black font-semibold rounded transition-colors"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
