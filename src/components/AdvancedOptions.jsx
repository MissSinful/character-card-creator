import React from 'react';
import { Info } from 'lucide-react';

/**
 * Advanced options for power users
 * System prompt, example messages, creator notes, etc.
 */
export default function AdvancedOptions({ card, updateCard }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-medium text-zinc-100">Advanced Options</h2>
        <p className="text-sm text-zinc-500">
          Optional fields for fine-tuning character behavior
        </p>
      </div>

      {/* System Prompt */}
      <div>
        <div className="flex items-start gap-2 mb-1">
          <label className="block text-sm font-medium text-zinc-300">
            System Prompt
          </label>
          <div className="group relative">
            <Info className="w-4 h-4 text-zinc-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-400 z-10">
              Custom instructions prepended to the system message. Use for specific behavior rules or persona guidance.
            </div>
          </div>
        </div>
        <textarea
          value={card.system_prompt}
          onChange={(e) => updateCard('system_prompt', e.target.value)}
          placeholder="Optional system instructions for the AI. e.g., 'Always refer to {{user}} by their title. Never break character.'"
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
        />
      </div>

      {/* Post History Instructions */}
      <div>
        <div className="flex items-start gap-2 mb-1">
          <label className="block text-sm font-medium text-zinc-300">
            Post History Instructions
          </label>
          <div className="group relative">
            <Info className="w-4 h-4 text-zinc-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-400 z-10">
              Instructions inserted after the chat history. Often called "jailbreak" or "NSFW prompt" position.
            </div>
          </div>
        </div>
        <textarea
          value={card.post_history_instructions}
          onChange={(e) => updateCard('post_history_instructions', e.target.value)}
          placeholder="Instructions placed after chat history..."
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
        />
      </div>

      {/* Example Messages */}
      <div>
        <div className="flex items-start gap-2 mb-1">
          <label className="block text-sm font-medium text-zinc-300">
            Example Messages
          </label>
          <div className="group relative">
            <Info className="w-4 h-4 text-zinc-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-400 z-10">
              Example dialogue showing how the character speaks. Format: {"<START>"} to begin, {"{{char}}:"} and {"{{user}}:"} for speakers.
            </div>
          </div>
        </div>
        <textarea
          value={card.mes_example}
          onChange={(e) => updateCard('mes_example', e.target.value)}
          placeholder={`<START>
{{user}}: How are you feeling today?
{{char}}: *sighs and sets down his pen* That's a rather personal question, don't you think? *His eyes meet yours briefly before returning to his work* Fine. I'm fine.`}
          rows={6}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
        />
      </div>

      {/* Personality (legacy field) */}
      <div>
        <div className="flex items-start gap-2 mb-1">
          <label className="block text-sm font-medium text-zinc-300">
            Personality
          </label>
          <div className="group relative">
            <Info className="w-4 h-4 text-zinc-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-400 z-10">
              Legacy field. Most cards put everything in Description, but some frontends use this separately.
            </div>
          </div>
        </div>
        <textarea
          value={card.personality}
          onChange={(e) => updateCard('personality', e.target.value)}
          placeholder="Short personality summary (often left empty, folded into description)"
          rows={2}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Divider */}
      <hr className="border-zinc-800" />

      {/* Metadata section */}
      <div>
        <h3 className="text-sm font-medium text-zinc-300 mb-4">Metadata</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Creator */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Creator
            </label>
            <input
              type="text"
              value={card.creator}
              onChange={(e) => updateCard('creator', e.target.value)}
              placeholder="Your name or alias"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Character Version
            </label>
            <input
              type="text"
              value={card.character_version}
              onChange={(e) => updateCard('character_version', e.target.value)}
              placeholder="e.g., 1.0, main, v2"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Creator Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Creator Notes
        </label>
        <textarea
          value={card.creator_notes}
          onChange={(e) => updateCard('creator_notes', e.target.value)}
          placeholder="Notes for other users: recommended settings, content warnings, usage tips..."
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>
    </div>
  );
}
