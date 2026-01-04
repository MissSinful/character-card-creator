import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Copy, Check } from 'lucide-react';

/**
 * Editor for alternate greetings / opening scenarios
 * Collapsible cards for each greeting
 */
export default function AltGreetingsEditor({
  greetings,
  description,
  onAdd,
  onUpdate,
  onRemove,
  isLoading,
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [scenarioHint, setScenarioHint] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const hasDescription = description?.trim().length > 0;

  const handleGenerate = () => {
    onAdd(scenarioHint);
    setScenarioHint('');
  };

  const handleCopy = async (index) => {
    await navigator.clipboard.writeText(greetings[index]);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getPreview = (text) => {
    if (!text) return 'Empty greeting';
    const cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.length > 100 ? cleaned.substring(0, 100) + '...' : cleaned;
  };

  const getWordCount = (text) => {
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-zinc-100">Alternate Greetings</h2>
        <p className="text-sm text-zinc-500">
          {greetings.length} greeting{greetings.length !== 1 ? 's' : ''} - Different opening scenarios for variety
        </p>
      </div>

      {/* Add new greeting section */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-3">
        <label className="block text-sm font-medium text-zinc-300">
          Add New Greeting
        </label>
        <input
          type="text"
          value={scenarioHint}
          onChange={(e) => setScenarioHint(e.target.value)}
          placeholder="Optional: scenario hint (e.g., 'at a gala', 'finding a secret', 'late night encounter')"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !hasDescription}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Generate Greeting
            </>
          )}
        </button>
        {!hasDescription && (
          <p className="text-xs text-yellow-500">
            Generate a character description first to enable greeting generation.
          </p>
        )}
      </div>

      {/* Greetings list */}
      {greetings.length > 0 ? (
        <div className="space-y-3">
          {greetings.map((greeting, index) => (
            <div
              key={index}
              className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden"
            >
              {/* Collapsed header */}
              <div
                onClick={() => toggleExpanded(index)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-750"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-zinc-700 rounded text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-zinc-400 truncate">
                    {getPreview(greeting)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-zinc-500">
                    {getWordCount(greeting)} words
                  </span>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {expandedIndex === index && (
                <div className="px-4 pb-4 space-y-3 border-t border-zinc-700">
                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      onClick={() => handleCopy(index)}
                      className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-xs"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onRemove(index)}
                      className="flex items-center gap-1 px-2 py-1 bg-red-900/50 hover:bg-red-900 text-red-400 rounded text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                  <textarea
                    value={greeting}
                    onChange={(e) => onUpdate(index, e.target.value)}
                    rows={12}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm leading-relaxed"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-500">
          <p>No alternate greetings yet.</p>
          <p className="text-sm mt-1">Generate one above to add variety to your character.</p>
        </div>
      )}
    </div>
  );
}
