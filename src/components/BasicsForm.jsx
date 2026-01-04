import React, { useRef } from 'react';
import { Sparkles, Upload, X, Image as ImageIcon, User, Globe } from 'lucide-react';
import { loadImageAsDataURL } from '../lib/png';

// Placeholder text for different card types
const PLACEHOLDERS = {
  character: {
    name: 'e.g., Adrian Blackwood',
    title: 'e.g., CEO, Knight',
    age: 'e.g., 32, Late 20s',
    keyTraits: 'e.g.:\n- Cold and professional\n- Secretly protective\n- Dry sense of humor',
    appearance: 'e.g.:\n- Tall, dark hair, silver eyes\n- Always wears suits\n- Scar on left hand',
    scenario: 'The setting and situation...\nUse {{user}} for the player',
    relationship: 'e.g., Boss, Childhood friend, Rival',
    notes: 'Backstory, themes, behaviors, writing style...',
  },
  narrator: {
    name: 'e.g., The Narrator, Eldoria, Zombie Survival',
    title: 'e.g., Dark Fantasy, Sci-Fi Horror',
    keyTraits: 'e.g.:\n- Atmospheric and descriptive\n- Morally gray choices\n- NPCs have their own goals\n- Actions have consequences',
    appearance: 'e.g.:\n- Medieval fantasy setting\n- Magic is rare and costly\n- Dangerous wilderness\n- Political intrigue in cities',
    scenario: 'The world premise...\n{{user}} is a traveler who...',
    relationship: 'e.g., Adventurer, Survivor, Chosen One',
    notes: 'World lore, factions, recurring NPCs, tone...',
  },
};

/**
 * Form for inputting basic character/narrator information
 * This data feeds into AI generation
 */
export default function BasicsForm({ basics, updateBasics, onGenerate, isLoading, imageDataUrl, onImageChange }) {
  const imageInputRef = useRef(null);
  const isNarrator = basics.cardType === 'narrator';
  const ph = PLACEHOLDERS[basics.cardType] || PLACEHOLDERS.character;

  const handleChange = (field) => (e) => {
    updateBasics(field, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image too large. Maximum size is 10MB.');
      return;
    }
    try {
      const dataUrl = await loadImageAsDataURL(file);
      onImageChange(dataUrl);
    } catch (err) {
      alert('Failed to load image: ' + err.message);
    }
    e.target.value = '';
  };

  const isValid = basics.name?.trim() && basics.keyTraits?.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Type Selector */}
      <div className="flex gap-2 p-1 bg-zinc-800 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => updateBasics('cardType', 'character')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            !isNarrator
              ? 'bg-purple-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <User className="w-4 h-4" />
          Character
        </button>
        <button
          type="button"
          onClick={() => updateBasics('cardType', 'narrator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isNarrator
              ? 'bg-purple-600 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          World / Narrator
        </button>
      </div>

      {/* Top section: Image + Basic fields */}
      <div className="flex gap-4">
        {/* Image upload - compact */}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="relative flex-shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500/50 cursor-pointer overflow-hidden bg-zinc-800/50 transition-colors"
        >
          {imageDataUrl ? (
            <>
              <img src={imageDataUrl} alt="Card" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onImageChange(null); }}
                className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-500 rounded-full text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <ImageIcon className="w-8 h-8 mb-1" />
              <span className="text-xs">Add Image</span>
            </div>
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Name, Title, Age, Gender - adapts for narrator mode */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              {isNarrator ? 'World / Card Name' : 'Name'} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={basics.name}
              onChange={handleChange('name')}
              placeholder={ph.name}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              {isNarrator ? 'Genre / Setting Type' : 'Title / Role'}
            </label>
            <input
              type="text"
              value={basics.title}
              onChange={handleChange('title')}
              placeholder={ph.title}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          {!isNarrator && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  value={basics.age}
                  onChange={handleChange('age')}
                  placeholder={ph.age}
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
            </>
          )}
        </div>
      </div>

      {/* Traits and Setting - side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            {isNarrator ? 'Narrator Style / World Rules' : 'Key Personality Traits'} <span className="text-red-400">*</span>
          </label>
          <textarea
            value={basics.keyTraits}
            onChange={handleChange('keyTraits')}
            placeholder={ph.keyTraits}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            {isNarrator ? 'World Details / Setting' : 'Appearance Notes'}
          </label>
          <textarea
            value={basics.appearanceNotes}
            onChange={handleChange('appearanceNotes')}
            placeholder={ph.appearance}
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
      </div>

      {/* Scenario and Notes - side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            {isNarrator ? 'World Premise / Hook' : 'Scenario / Premise'}
          </label>
          <textarea
            value={basics.scenarioPremise}
            onChange={handleChange('scenarioPremise')}
            placeholder={ph.scenario}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            {isNarrator ? 'Lore / NPCs / Factions' : 'Additional Notes / Themes'}
          </label>
          <textarea
            value={basics.additionalNotes}
            onChange={handleChange('additionalNotes')}
            placeholder={ph.notes}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* User Role */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1">
          {isNarrator ? '{{user}}\'s Role in the World' : 'Relationship to {{user}}'}
        </label>
        <input
          type="text"
          value={basics.relationshipToUser}
          onChange={handleChange('relationshipToUser')}
          placeholder={ph.relationship}
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
              {isNarrator ? 'Generating World...' : 'Generating Description...'}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {isNarrator ? 'Generate World Card' : 'Generate Description'}
            </>
          )}
        </button>
        {!isValid && (
          <p className="text-center text-sm text-zinc-500 mt-2">
            Fill in {isNarrator ? 'World Name and Style/Rules' : 'Name and Key Traits'} to generate
          </p>
        )}
      </div>
    </form>
  );
}
