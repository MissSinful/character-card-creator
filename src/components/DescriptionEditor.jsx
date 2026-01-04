import React, { useState } from 'react';
import { RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import TagManager from './TagManager';

/**
 * Editor for the generated character description
 * Includes tag management and regeneration options
 */
export default function DescriptionEditor({
  card,
  updateCard,
  onRegenerate,
  onGenerateTags,
  addTag,
  removeTag,
  loading,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(card.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = card.description
    ? card.description.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-100">Character Description</h2>
          <p className="text-sm text-zinc-500">
            {wordCount > 0 ? `${wordCount} words` : 'No description yet'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!card.description}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={() => onRegenerate()}
            disabled={loading.description}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm"
          >
            {loading.description ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Name field */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Character Name
        </label>
        <input
          type="text"
          value={card.name}
          onChange={(e) => updateCard('name', e.target.value)}
          placeholder="Character name"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Description textarea */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Description
        </label>
        <textarea
          value={card.description}
          onChange={(e) => updateCard('description', e.target.value)}
          placeholder="Character description will appear here after generation, or you can write your own..."
          rows={18}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Scenario field */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Scenario
        </label>
        <textarea
          value={card.scenario}
          onChange={(e) => updateCard('scenario', e.target.value)}
          placeholder="Brief scenario description (optional, some frontends use this)"
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Tags section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-zinc-300">
            Tags
          </label>
          <button
            onClick={() => onGenerateTags()}
            disabled={loading.tags || !card.description}
            className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs"
          >
            {loading.tags ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Auto-generate
              </>
            )}
          </button>
        </div>
        <TagManager
          tags={card.tags}
          onAdd={addTag}
          onRemove={removeTag}
        />
      </div>
    </div>
  );
}
