import React, { useRef } from 'react';
import { Sparkles, Upload, X, Image as ImageIcon } from 'lucide-react';
import { loadImageAsDataURL } from '../lib/png';

/**
 * Form for inputting basic character information
 * This data feeds into AI generation
 */
export default function BasicsForm({ basics, updateBasics, onGenerate, isLoading, imageDataUrl, onImageChange }) {
  const imageInputRef = useRef(null);

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
      {/* Top section: Image + Basic fields */}
      <div className="flex gap-4">
        {/* Image upload - compact */}
        <div
          onClick={() => imageInputRef.current?.click()}
          className="relative flex-shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-zinc-700 hover:border-purple-500/50 cursor-pointer overflow-hidden bg-zinc-800/50 transition-colors"
        >
          {imageDataUrl ? (
            <>
              <img src={imageDataUrl} alt="Character" className="w-full h-full object-cover" />
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

        {/* Name, Title, Age, Gender */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Name <span className="text-red-400">*</span>
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
              placeholder="e.g., CEO, Knight"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Age
            </label>
            <input
              type="text"
              value={basics.age}
              onChange={handleChange('age')}
              placeholder="e.g., 32, Late 20s"
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
      </div>

      {/* Personality and Appearance - side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Key Personality Traits <span className="text-red-400">*</span>
          </label>
          <textarea
            value={basics.keyTraits}
            onChange={handleChange('keyTraits')}
            placeholder="e.g.:&#10;- Cold and professional&#10;- Secretly protective&#10;- Dry sense of humor"
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Appearance Notes
          </label>
          <textarea
            value={basics.appearanceNotes}
            onChange={handleChange('appearanceNotes')}
            placeholder="e.g.:&#10;- Tall, dark hair, silver eyes&#10;- Always wears suits&#10;- Scar on left hand"
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
      </div>

      {/* Scenario and Relationship - side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Scenario / Premise
          </label>
          <textarea
            value={basics.scenarioPremise}
            onChange={handleChange('scenarioPremise')}
            placeholder="The setting and situation...&#10;Use {{user}} for the player"
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Additional Notes / Themes
          </label>
          <textarea
            value={basics.additionalNotes}
            onChange={handleChange('additionalNotes')}
            placeholder="Backstory, themes, behaviors, writing style..."
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
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
