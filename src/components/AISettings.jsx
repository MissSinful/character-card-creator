import React, { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getAISettings, saveAISettings, PROVIDERS } from '../lib/ai';

/**
 * AI provider settings panel
 * Supports Anthropic, OpenAI, and custom/local endpoints
 */
export default function AISettings({ onSettingsChange, compact = false }) {
  const [settings, setSettings] = useState(getAISettings);
  const [showKey, setShowKey] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const provider = PROVIDERS[settings.provider] || PROVIDERS.anthropic;
  const isConfigured = settings.apiKey?.trim() || settings.provider === 'custom';

  // Update local state when settings change
  useEffect(() => {
    setSettings(getAISettings());
  }, []);

  const handleChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };

    // When provider changes, update defaults
    if (field === 'provider') {
      const newProvider = PROVIDERS[value];
      newSettings.endpoint = newProvider.defaultEndpoint;
      newSettings.model = newProvider.defaultModel;
      newSettings.customModel = '';
    }

    setSettings(newSettings);
  };

  const handleSave = () => {
    saveAISettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSettingsChange?.();
  };

  // Compact view (for footer)
  if (compact && isConfigured && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400"
      >
        <Settings className="w-4 h-4" />
        <span>{provider.name}</span>
        <span className="text-green-400 text-xs">Configured</span>
      </button>
    );
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        onClick={() => compact && setExpanded(!expanded)}
        className={`flex items-center justify-between p-4 ${compact ? 'cursor-pointer hover:bg-zinc-800' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-zinc-400" />
          <span className="font-medium">AI Provider Settings</span>
          {isConfigured && <span className="text-xs text-green-400">Configured</span>}
        </div>
        {compact && (
          <button className="text-zinc-400">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Content */}
      {(!compact || expanded) && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-700 pt-4">
          {/* Provider selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(PROVIDERS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleChange('provider', p.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.provider === p.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              API Key {settings.provider === 'custom' && '(optional)'}
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder={settings.provider === 'anthropic' ? 'sk-ant-api03-...' : settings.provider === 'openai' ? 'sk-...' : 'Optional for local models'}
                className="w-full pr-10 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {settings.provider === 'anthropic' && (
                <>Get your key from <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">console.anthropic.com</a></>
              )}
              {settings.provider === 'openai' && (
                <>Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">platform.openai.com</a></>
              )}
              {settings.provider === 'custom' && 'Leave empty for local models that don\'t require authentication'}
            </p>
          </div>

          {/* Model selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Model
            </label>
            {provider.models.length > 0 ? (
              <select
                value={settings.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                {provider.models.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={settings.customModel || settings.model}
                onChange={(e) => handleChange('customModel', e.target.value)}
                placeholder="e.g., llama2, mistral, codellama"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            )}
          </div>

          {/* Custom endpoint (advanced) */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={settings.endpoint}
              onChange={(e) => handleChange('endpoint', e.target.value)}
              placeholder={provider.defaultEndpoint}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
            />
            <p className="text-xs text-zinc-500 mt-1">
              {settings.provider === 'custom'
                ? 'OpenAI-compatible endpoint (Ollama, LM Studio, text-generation-webui, etc.)'
                : 'Change only if using a proxy or custom endpoint'}
            </p>
          </div>

          {/* Save button */}
          <div className="flex justify-end gap-2 pt-2">
            {compact && (
              <button
                onClick={() => setExpanded(false)}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
