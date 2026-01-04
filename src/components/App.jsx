import React, { useState } from 'react';
import { useCharacterCard } from '../hooks/useCharacterCard';
import { useAIGeneration } from '../hooks/useAIGeneration';
import { downloadAsJSON, downloadAsPNG } from '../lib/export';
import { readCardFile } from '../lib/import';
import { hasApiKey } from '../lib/ai';

// Component imports
import BasicsForm from './BasicsForm';
import DescriptionEditor from './DescriptionEditor';
import FirstMessageEditor from './FirstMessageEditor';
import AltGreetingsEditor from './AltGreetingsEditor';
import AdvancedOptions from './AdvancedOptions';
import AISettings from './AISettings';
import GeneratingOverlay from './GeneratingOverlay';
import ImageUpload from './ImageUpload';

/**
 * Tab configuration
 */
const TABS = [
  { id: 'basics', label: 'Basics' },
  { id: 'description', label: 'Description' },
  { id: 'first_mes', label: 'First Message' },
  { id: 'greetings', label: 'Alt Greetings' },
  { id: 'advanced', label: 'Advanced' },
];

/**
 * Main application component
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('basics');
  const [apiKeySet, setApiKeySet] = useState(hasApiKey());

  // Character card state management
  const cardState = useCharacterCard({ autosave: true });
  const {
    card,
    basics,
    isDirty,
    imageDataUrl,
    updateCard,
    updateBasics,
    loadCard,
    reset,
    addTag,
    removeTag,
    removeAltGreeting,
    updateAltGreeting,
    setImage,
  } = cardState;

  // AI generation
  const ai = useAIGeneration(cardState);
  const {
    loading,
    isGenerating,
    wordCount,
    streamStatus,
    error,
    clearError,
    generateDescription,
    generateFirstMessage,
    generateAltGreeting,
    generateTags,
  } = ai;

  /**
   * Handle file import (JSON or PNG)
   */
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { card: cardData, imageDataUrl: importedImage } = await readCardFile(file);
      loadCard(cardData, importedImage);
      setActiveTab('description');
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }

    // Reset input
    event.target.value = '';
  };

  /**
   * Handle JSON export
   */
  const handleExportJSON = () => {
    downloadAsJSON(card);
    cardState.markSaved();
  };

  /**
   * Handle PNG export
   */
  const handleExportPNG = async () => {
    try {
      await downloadAsPNG(card, imageDataUrl);
      cardState.markSaved();
    } catch (err) {
      alert(`PNG export failed: ${err.message}`);
    }
  };

  /**
   * Handle description generation and tab switch
   */
  const handleGenerateDescription = async () => {
    const result = await generateDescription();
    if (result) {
      setActiveTab('description');
    }
  };

  /**
   * Render tab content
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basics':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,200px] gap-6">
            <BasicsForm
              basics={basics}
              updateBasics={updateBasics}
              onGenerate={handleGenerateDescription}
              isLoading={loading.description}
            />
            <div className="lg:order-first">
              <ImageUpload
                imageDataUrl={imageDataUrl}
                onImageChange={setImage}
              />
            </div>
          </div>
        );

      case 'description':
        return (
          <DescriptionEditor
            card={card}
            updateCard={updateCard}
            onRegenerate={generateDescription}
            onGenerateTags={generateTags}
            addTag={addTag}
            removeTag={removeTag}
            loading={loading}
          />
        );

      case 'first_mes':
        return (
          <FirstMessageEditor
            firstMes={card.first_mes}
            description={card.description}
            scenario={card.scenario}
            onChange={(value) => updateCard('first_mes', value)}
            onGenerate={generateFirstMessage}
            isLoading={loading.firstMessage}
          />
        );

      case 'greetings':
        return (
          <AltGreetingsEditor
            greetings={card.alternate_greetings}
            description={card.description}
            onAdd={generateAltGreeting}
            onUpdate={updateAltGreeting}
            onRemove={removeAltGreeting}
            isLoading={loading.altGreeting}
          />
        );

      case 'advanced':
        return (
          <AdvancedOptions
            card={card}
            updateCard={updateCard}
          />
        );

      default:
        return null;
    }
  };

  // Determine which generation is active for the overlay
  const activeGeneration = Object.entries(loading).find(([_, isLoading]) => isLoading)?.[0] || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4">
      {/* Loading overlay */}
      <GeneratingOverlay
        isVisible={isGenerating}
        status={activeGeneration}
        wordCount={wordCount}
        streamStatus={streamStatus}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-purple-400">&#10022;</span>
            Character Card Creator
            {isDirty && <span className="text-xs text-zinc-500">(unsaved)</span>}
          </h1>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="px-3 py-2 bg-zinc-800 hover:bg-red-900/50 border border-zinc-700 hover:border-red-700 rounded-lg text-sm text-zinc-300 hover:text-red-300 transition-colors"
            >
              New Character
            </button>

            <label className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg cursor-pointer text-sm">
              Import
              <input
                type="file"
                accept=".json,.png,image/png"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExportJSON}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm"
            >
              Export JSON
            </button>

            <button
              onClick={handleExportPNG}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium"
            >
              Export PNG
            </button>
          </div>
        </header>

        {/* AI Settings - show prominently if not configured */}
        {!apiKeySet && (
          <div className="mb-4">
            <AISettings onSettingsChange={() => setApiKeySet(hasApiKey())} />
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-300">
              &#10005;
            </button>
          </div>
        )}

        {/* Tab navigation */}
        <nav className="flex gap-1 mb-4 bg-zinc-900 p-1 rounded-lg">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={isGenerating}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <main className="bg-zinc-900 rounded-xl p-6">
          {renderTabContent()}
        </main>

        {/* Footer with AI settings (compact) */}
        {apiKeySet && (
          <footer className="mt-4 flex justify-end">
            <AISettings onSettingsChange={() => setApiKeySet(hasApiKey())} compact />
          </footer>
        )}
      </div>
    </div>
  );
}
