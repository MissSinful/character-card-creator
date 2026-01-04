import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Form for inputting basic character information
 * This data feeds into AI generation
 */
export default function BasicsForm({ basics, updateBasics, onGenerate, isLoading }) {
  const handleChange = (field) => (e) => {
    updateBasics(field, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  const isValid = basics.name?.trim() && basics.keyTraits?.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Title row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Character Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={basics.name}
            onChange={handleChange('name')}
            placeholder="e.g., Adrian Blackwood"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Title / Role
          </label>
          <input
            type="text"
            value={basics.title}
            onChange={handleChange('title')}
            placeholder="e.g., CEO, Knight, Professor"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Age and Gender row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Age
          </label>
          <input
            type="text"
            value={basics.age}
            onChange={handleChange('age')}
            placeholder="e.g., 32, Late 20s, Immortal"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Gender
          </label>
          <select
            value={basics.gender}
            onChange={handleChange('gender')}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Key Traits */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Key Personality Traits <span className="text-red-400">*</span>
        </label>
        <textarea
          value={basics.keyTraits}
          onChange={handleChange('keyTraits')}
          placeholder="List the core traits that define this character. e.g.:&#10;- Cold and professional on the surface&#10;- Secretly protective and possessive&#10;- Struggles with vulnerability&#10;- Dry sense of humor"
          rows={4}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
        />
        <p className="text-xs text-zinc-500 mt-1">Bullet points or comma-separated work best</p>
      </div>

      {/* Appearance Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Appearance Notes
        </label>
        <textarea
          value={basics.appearanceNotes}
          onChange={handleChange('appearanceNotes')}
          placeholder="Key visual details. e.g.:&#10;- Tall with dark hair, silver eyes&#10;- Always wears tailored suits&#10;- Has a scar on his left hand&#10;- Sharp features, rarely smiles"
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
        />
      </div>

      {/* Scenario/Premise */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Scenario / Premise
        </label>
        <textarea
          value={basics.scenarioPremise}
          onChange={handleChange('scenarioPremise')}
          placeholder="The setting and situation. e.g.:&#10;{{user}} is the new assistant to the notoriously demanding CEO of Blackwood Industries. They must work closely together on a critical project, leading to tension and unexpected moments."
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
        />
        <p className="text-xs text-zinc-500 mt-1">Use {"{{user}}"} to reference the player character</p>
      </div>

      {/* Relationship to User */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Relationship to {"{{user}}"}
        </label>
        <input
          type="text"
          value={basics.relationshipToUser}
          onChange={handleChange('relationshipToUser')}
          placeholder="e.g., Boss, Childhood friend, Rival, Arranged marriage partner"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          Additional Notes / Themes
        </label>
        <textarea
          value={basics.additionalNotes}
          onChange={handleChange('additionalNotes')}
          placeholder="Any other details: themes to explore, specific behaviors, backstory elements, writing style preferences..."
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Generate Button */}
      <div className="pt-4 border-t border-zinc-800">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating Description...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Description
            </>
          )}
        </button>
        {!isValid && (
          <p className="text-center text-sm text-zinc-500 mt-2">
            Fill in Name and Key Traits to generate
          </p>
        )}
      </div>
    </form>
  );
}
