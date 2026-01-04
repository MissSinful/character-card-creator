/**
 * AI API wrapper supporting multiple providers
 */

const STORAGE_KEY_PREFIX = 'character-card-creator-';
const DEFAULT_MAX_TOKENS = 4000;

const DEFAULT_SYSTEM_PROMPT = `You are an expert character writer specializing in detailed, psychologically complex characters for roleplay. Write in a vivid, engaging style. Do not include any preamble, explanation, or meta-commentary - output only the requested content.`;

/**
 * Provider configurations
 */
export const PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    defaultEndpoint: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-sonnet-4-20250514',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku (faster)' },
    ],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultEndpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini (faster)' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom / Local',
    defaultEndpoint: 'http://localhost:5000/v1/chat/completions',
    defaultModel: 'local-model',
    models: [],
  },
};

/**
 * Get AI settings from localStorage
 */
export function getAISettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'ai-settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}

  return {
    provider: 'anthropic',
    apiKey: '',
    endpoint: PROVIDERS.anthropic.defaultEndpoint,
    model: PROVIDERS.anthropic.defaultModel,
    customModel: '',
  };
}

/**
 * Save AI settings to localStorage
 */
export function saveAISettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'ai-settings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save AI settings:', e);
  }
}

/**
 * Check if AI is configured
 */
export function hasApiKey() {
  const settings = getAISettings();
  return Boolean(settings.apiKey?.trim());
}

/**
 * Get the current provider config
 */
export function getCurrentProvider() {
  const settings = getAISettings();
  return PROVIDERS[settings.provider] || PROVIDERS.anthropic;
}

/**
 * Call AI based on current provider settings
 */
export async function callAI(prompt, options = {}) {
  const settings = getAISettings();
  const {
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    maxTokens = DEFAULT_MAX_TOKENS,
  } = options;

  if (!settings.apiKey && settings.provider !== 'custom') {
    throw new Error('API key not set. Please configure your AI provider in settings.');
  }

  const model = settings.customModel || settings.model;

  switch (settings.provider) {
    case 'anthropic':
      return callAnthropic(prompt, {
        apiKey: settings.apiKey,
        endpoint: settings.endpoint || PROVIDERS.anthropic.defaultEndpoint,
        model,
        systemPrompt,
        maxTokens,
      });

    case 'openai':
      return callOpenAI(prompt, {
        apiKey: settings.apiKey,
        endpoint: settings.endpoint || PROVIDERS.openai.defaultEndpoint,
        model,
        systemPrompt,
        maxTokens,
      });

    case 'custom':
      return callOpenAICompatible(prompt, {
        apiKey: settings.apiKey,
        endpoint: settings.endpoint || PROVIDERS.custom.defaultEndpoint,
        model,
        systemPrompt,
        maxTokens,
      });

    default:
      throw new Error(`Unknown provider: ${settings.provider}`);
  }
}

/**
 * Call Anthropic API
 */
async function callAnthropic(prompt, { apiKey, endpoint, model, systemPrompt, maxTokens }) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt, { apiKey, endpoint, model, systemPrompt, maxTokens }) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Call OpenAI-compatible API (for local models like Ollama, LM Studio, etc.)
 */
async function callOpenAICompatible(prompt, { apiKey, endpoint, model, systemPrompt, maxTokens }) {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Only add auth header if API key is provided
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Call AI with streaming response
 * @param {string} prompt - The user prompt
 * @param {Function} onProgress - Callback with { text, wordCount } as content streams
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} The complete generated text
 */
export async function callAIStream(prompt, onProgress, options = {}) {
  const settings = getAISettings();
  const {
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    maxTokens = DEFAULT_MAX_TOKENS,
  } = options;

  if (!settings.apiKey && settings.provider !== 'custom') {
    throw new Error('API key not set. Please configure your AI provider in settings.');
  }

  const model = settings.customModel || settings.model;

  switch (settings.provider) {
    case 'anthropic':
      return streamAnthropic(prompt, onProgress, {
        apiKey: settings.apiKey,
        endpoint: settings.endpoint || PROVIDERS.anthropic.defaultEndpoint,
        model,
        systemPrompt,
        maxTokens,
      });

    case 'openai':
      return streamOpenAI(prompt, onProgress, {
        apiKey: settings.apiKey,
        endpoint: settings.endpoint || PROVIDERS.openai.defaultEndpoint,
        model,
        systemPrompt,
        maxTokens,
      });

    case 'custom':
      // Most custom endpoints (Ollama, LM Studio, etc.) use OpenAI-compatible format
      return streamCustom(prompt, onProgress, {
        apiKey: settings.apiKey,
        endpoint: settings.endpoint || PROVIDERS.custom.defaultEndpoint,
        model,
        systemPrompt,
        maxTokens,
      });

    default:
      // Ultimate fallback to non-streaming
      const result = await callAI(prompt, options);
      onProgress({ text: result, wordCount: countWords(result), status: 'writing' });
      return result;
  }
}

/**
 * Count words in text
 */
function countWords(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

/**
 * Stream from Anthropic API
 */
async function streamAnthropic(prompt, onProgress, { apiKey, endpoint, model, systemPrompt, maxTokens }) {
  // Signal connection started
  onProgress({ text: '', wordCount: 0, status: 'connecting' });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  // Signal connected, waiting for content
  onProgress({ text: '', wordCount: 0, status: 'connected' });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Append to buffer and process complete lines
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');

    // Keep the last potentially incomplete line in the buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);

        // Handle different event types
        if (parsed.type === 'message_start') {
          onProgress({ text: '', wordCount: 0, status: 'thinking' });
        } else if (parsed.type === 'content_block_start') {
          onProgress({ text: fullText, wordCount: countWords(fullText), status: 'writing' });
        } else if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
          fullText += parsed.delta.text;
          onProgress({ text: fullText, wordCount: countWords(fullText), status: 'writing' });
        }
      } catch {
        // Skip unparseable lines
      }
    }
  }

  return fullText;
}

/**
 * Stream from OpenAI API
 */
async function streamOpenAI(prompt, onProgress, { apiKey, endpoint, model, systemPrompt, maxTokens }) {
  onProgress({ text: '', wordCount: 0, status: 'connecting' });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  onProgress({ text: '', wordCount: 0, status: 'thinking' });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onProgress({ text: fullText, wordCount: countWords(fullText), status: 'writing' });
        }
      } catch {
        // Skip unparseable lines
      }
    }
  }

  return fullText;
}

/**
 * Stream from custom OpenAI-compatible endpoint (Ollama, LM Studio, etc.)
 */
async function streamCustom(prompt, onProgress, { apiKey, endpoint, model, systemPrompt, maxTokens }) {
  onProgress({ text: '', wordCount: 0, status: 'connecting' });

  const headers = {
    'Content-Type': 'application/json',
  };

  // Only add auth if API key provided (local models often don't need it)
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  onProgress({ text: '', wordCount: 0, status: 'thinking' });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Handle SSE format (data: {...})
      if (trimmed.startsWith('data: ')) {
        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            onProgress({ text: fullText, wordCount: countWords(fullText), status: 'writing' });
          }
        } catch {
          // Skip unparseable lines
        }
      } else {
        // Some endpoints send raw JSON per line (like Ollama's native format)
        try {
          const parsed = JSON.parse(trimmed);
          // Ollama format
          if (parsed.message?.content) {
            fullText += parsed.message.content;
            onProgress({ text: fullText, wordCount: countWords(fullText), status: 'writing' });
          }
          // OpenAI format without "data:" prefix
          else if (parsed.choices?.[0]?.delta?.content) {
            fullText += parsed.choices[0].delta.content;
            onProgress({ text: fullText, wordCount: countWords(fullText), status: 'writing' });
          }
        } catch {
          // Skip unparseable lines
        }
      }
    }
  }

  return fullText;
}

export default { callAI, callAIStream, getAISettings, saveAISettings, hasApiKey, PROVIDERS };
