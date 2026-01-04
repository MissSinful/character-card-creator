import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle, Info } from 'lucide-react';

/**
 * Editor for the character's first message / opening post
 */
export default function FirstMessageEditor({
  firstMes,
  description,
  scenario,
  onChange,
  onGenerate,
  isLoading,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(firstMes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = firstMes
    ? firstMes.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const hasDescription = description?.trim().length > 0;
  const hasScenario = scenario?.trim().length > 0;
  const hasHint = firstMes?.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-zinc-100">First Message</h2>
          <p className="text-sm text-zinc-500">
            {wordCount > 0 ? `${wordCount} words` : 'No first message yet'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={!firstMes}
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
            onClick={() => onGenerate()}
            disabled={isLoading || !hasDescription}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {firstMes ? 'Regenerate' : 'Generate'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning if no description */}
      {!hasDescription && (
        <div className="flex items-start gap-3 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-200">Description required</p>
            <p className="text-xs text-yellow-200/70 mt-1">
              Generate or write a character description first. The first message is based on the description.
            </p>
          </div>
        </div>
      )}

      {/* Generation info box */}
      {hasDescription && (
        <div className="flex items-start gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <Info className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-400">
            {hasHint ? (
              <>
                <span className="text-purple-400">Generate will use your text as a starting point</span>
                <span className="text-zinc-500"> + Description{hasScenario && ' + Scenario'}</span>
              </>
            ) : (
              <>
                <span>Generate will use: </span>
                <span className="text-zinc-300">Description</span>
                {hasScenario && <span className="text-zinc-300"> + Scenario</span>}
                {!hasScenario && <span className="text-zinc-500"> (no scenario set)</span>}
              </>
            )}
          </div>
        </div>
      )}

      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Opening Message
        </label>
        <textarea
          value={firstMes}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Leave empty to generate from scratch, or write a scene idea / direction here and Generate will expand on it..."
          rows={20}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm leading-relaxed"
        />
        <p className="text-xs text-zinc-500 mt-1">
          Tip: Use {"{{user}}"} to reference the player. Include internal monologue in *italics* for the character's thoughts.
        </p>
      </div>
    </div>
  );
}
