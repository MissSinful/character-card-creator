import { useState, useCallback, useEffect } from 'react';

/**
 * Default empty card state
 */
const emptyCard = {
  name: '',
  description: '',
  personality: '',
  first_mes: '',
  avatar: '',
  mes_example: '',
  scenario: '',
  creator_notes: '',
  system_prompt: '',
  post_history_instructions: '',
  alternate_greetings: [],
  tags: [],
  creator: '',
  character_version: 'main',
  extensions: {},
  character_book: null,
};

/**
 * Default basics (input form) state
 */
const emptyBasics = {
  cardType: 'character', // 'character' or 'narrator'
  name: '',
  title: '',
  age: '',
  gender: 'Male',
  keyTraits: '',
  appearanceNotes: '',
  scenarioPremise: '',
  relationshipToUser: '',
  additionalNotes: '',
};

const STORAGE_KEY = 'character-card-creator-draft';

/**
 * Hook for managing character card state
 * @param {Object} options
 * @param {boolean} options.autosave - Enable localStorage autosave
 * @returns {Object} State and actions
 */
export function useCharacterCard(options = {}) {
  const { autosave = true } = options;

  // Main card data (the output)
  const [card, setCard] = useState(emptyCard);

  // Character image (data URL)
  const [imageDataUrl, setImageDataUrl] = useState(null);

  // Basics form data (the input)
  const [basics, setBasics] = useState(emptyBasics);

  // Track if there are unsaved changes
  const [isDirty, setIsDirty] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (autosave) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { card: savedCard, basics: savedBasics, image: savedImage } = JSON.parse(saved);
          if (savedCard) setCard(savedCard);
          if (savedBasics) setBasics(savedBasics);
          if (savedImage) setImageDataUrl(savedImage);
        }
      } catch (e) {
        console.warn('Failed to load draft from localStorage:', e);
      }
    }
  }, [autosave]);

  // Save to localStorage on changes
  useEffect(() => {
    if (autosave && isDirty) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ card, basics, image: imageDataUrl }));
      } catch (e) {
        console.warn('Failed to save draft to localStorage:', e);
      }
    }
  }, [card, basics, imageDataUrl, isDirty, autosave]);

  /**
   * Update a single card field
   */
  const updateCard = useCallback((field, value) => {
    setCard(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  /**
   * Update multiple card fields
   */
  const updateCardMultiple = useCallback((updates) => {
    setCard(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  /**
   * Update a single basics field
   */
  const updateBasics = useCallback((field, value) => {
    setBasics(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  /**
   * Load a complete card (from import)
   * @param {Object} cardData - Card fields
   * @param {string|null} image - Optional image data URL
   */
  const loadCard = useCallback((cardData, image = null) => {
    setCard({ ...emptyCard, ...cardData });
    if (image) {
      setImageDataUrl(image);
    }
    // Also populate basics from card if possible
    setBasics(prev => ({
      ...prev,
      name: cardData.name || prev.name,
      scenarioPremise: cardData.scenario || prev.scenarioPremise,
    }));
    setIsDirty(true);
  }, []);

  /**
   * Reset everything to empty
   */
  const reset = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('Discard unsaved changes?');
      if (!confirmed) return false;
    }
    setCard(emptyCard);
    setBasics(emptyBasics);
    setImageDataUrl(null);
    setIsDirty(false);
    if (autosave) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  }, [isDirty, autosave]);

  /**
   * Update character image
   */
  const setImage = useCallback((dataUrl) => {
    setImageDataUrl(dataUrl);
    setIsDirty(true);
  }, []);

  /**
   * Add an alternate greeting
   */
  const addAltGreeting = useCallback((greeting) => {
    setCard(prev => ({
      ...prev,
      alternate_greetings: [...prev.alternate_greetings, greeting],
    }));
    setIsDirty(true);
  }, []);

  /**
   * Update an alternate greeting by index
   */
  const updateAltGreeting = useCallback((index, greeting) => {
    setCard(prev => {
      const newGreetings = [...prev.alternate_greetings];
      newGreetings[index] = greeting;
      return { ...prev, alternate_greetings: newGreetings };
    });
    setIsDirty(true);
  }, []);

  /**
   * Remove an alternate greeting by index
   */
  const removeAltGreeting = useCallback((index) => {
    setCard(prev => ({
      ...prev,
      alternate_greetings: prev.alternate_greetings.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }, []);

  /**
   * Add a tag
   */
  const addTag = useCallback((tag) => {
    const trimmed = tag.trim();
    if (trimmed && !card.tags.includes(trimmed)) {
      setCard(prev => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
      setIsDirty(true);
    }
  }, [card.tags]);

  /**
   * Remove a tag
   */
  const removeTag = useCallback((tag) => {
    setCard(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
    setIsDirty(true);
  }, []);

  /**
   * Set all tags (replace)
   */
  const setTags = useCallback((tags) => {
    setCard(prev => ({ ...prev, tags }));
    setIsDirty(true);
  }, []);

  /**
   * Mark as saved (clears dirty flag)
   */
  const markSaved = useCallback(() => {
    setIsDirty(false);
  }, []);

  return {
    // State
    card,
    basics,
    isDirty,
    imageDataUrl,

    // Card actions
    updateCard,
    updateCardMultiple,
    loadCard,
    reset,

    // Basics actions
    updateBasics,

    // Image actions
    setImage,

    // Alt greetings actions
    addAltGreeting,
    updateAltGreeting,
    removeAltGreeting,

    // Tags actions
    addTag,
    removeTag,
    setTags,

    // Misc
    markSaved,
  };
}

export default useCharacterCard;
