import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

/**
 * Component for managing character tags
 * Allows adding, removing, and displaying tags
 */
export default function TagManager({ tags, onAdd, onRemove }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      // Handle comma-separated input
      const newTags = trimmed.split(',').map(t => t.trim()).filter(Boolean);
      newTags.forEach(tag => onAdd(tag));
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Tag display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-full text-sm text-zinc-300"
            >
              {tag}
              <button
                onClick={() => onRemove(tag)}
                className="p-0.5 hover:text-red-400 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tag input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags (comma separated)..."
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={addTag}
          disabled={!inputValue.trim()}
          className="flex items-center gap-1 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {tags.length === 0 && (
        <p className="text-xs text-zinc-500">
          No tags yet. Add manually or use auto-generate.
        </p>
      )}
    </div>
  );
}
