import { useState, useCallback } from 'react';
import { callAIStream } from '../lib/ai';
import {
  descriptionPrompt,
  firstMessagePrompt,
  altGreetingPrompt,
  tagsPrompt,
  applyTone,
} from '../lib/prompts';

/**
 * Hook for AI generation operations
 * @param {Object} cardActions - Actions from useCharacterCard
 * @returns {Object} Generation functions and loading states
 */
export function useAIGeneration(cardActions) {
  const {
    card,
    basics,
    updateCard,
    updateCardMultiple,
    addAltGreeting,
    setTags,
  } = cardActions;

  // Loading states for each generation type
  const [loading, setLoading] = useState({
    description: false,
    firstMessage: false,
    altGreeting: false,
    tags: false,
  });

  // Error state
  const [error, setError] = useState(null);

  // Streaming progress state
  const [wordCount, setWordCount] = useState(0);
  const [streamStatus, setStreamStatus] = useState('idle'); // idle, connecting, connected, thinking, writing

  /**
   * Set loading state for a specific type
   */
  const setLoadingState = useCallback((type, isLoading) => {
    setLoading(prev => ({ ...prev, [type]: isLoading }));
    if (isLoading) {
      setWordCount(0);
      setStreamStatus('idle');
    } else {
      setStreamStatus('idle');
    }
  }, []);

  /**
   * Handle streaming progress updates
   */
  const handleProgress = useCallback(({ wordCount: count, status }) => {
    setWordCount(count);
    if (status) {
      setStreamStatus(status);
    }
  }, []);

  /**
   * Generate character description from basics
   * @param {string} tone - Optional tone modifier
   */
  const generateDescription = useCallback(async (tone = null) => {
    if (!basics.name || !basics.keyTraits) {
      setError('Please fill in at least Name and Key Traits');
      return null;
    }

    setLoadingState('description', true);
    setError(null);

    try {
      let prompt = descriptionPrompt(basics);
      if (tone) {
        prompt = applyTone(prompt, tone);
      }

      const result = await callAIStream(prompt, handleProgress);

      // Update card with generated description and name
      updateCardMultiple({
        description: result,
        name: basics.name,
        scenario: basics.scenarioPremise || card.scenario,
      });

      return result;
    } catch (err) {
      setError(`Failed to generate description: ${err.message}`);
      return null;
    } finally {
      setLoadingState('description', false);
    }
  }, [basics, card.scenario, updateCardMultiple, setLoadingState, handleProgress]);

  /**
   * Generate first message from description
   * @param {string} hint - Optional hint/direction (uses current first_mes if not provided)
   * @param {string} tone - Optional tone modifier
   */
  const generateFirstMessage = useCallback(async (hint = null, tone = null) => {
    if (!card.description) {
      setError('Please generate or write a description first');
      return null;
    }

    setLoadingState('firstMessage', true);
    setError(null);

    try {
      // Use provided hint, or current first_mes content as hint
      const hintText = hint !== null ? hint : card.first_mes;
      const cardType = basics.cardType || 'character';
      let prompt = firstMessagePrompt(card.description, card.scenario, hintText, cardType);
      if (tone) {
        prompt = applyTone(prompt, tone);
      }

      const result = await callAIStream(prompt, handleProgress);
      updateCard('first_mes', result);
      return result;
    } catch (err) {
      setError(`Failed to generate first message: ${err.message}`);
      return null;
    } finally {
      setLoadingState('firstMessage', false);
    }
  }, [card.description, card.scenario, card.first_mes, basics.cardType, updateCard, setLoadingState, handleProgress]);

  /**
   * Generate an alternate greeting
   * @param {string} scenarioHint - Optional hint for specific scenario
   * @param {string} tone - Optional tone modifier
   */
  const generateAltGreeting = useCallback(async (scenarioHint = '', tone = null) => {
    if (!card.description) {
      setError('Please generate or write a description first');
      return null;
    }

    setLoadingState('altGreeting', true);
    setError(null);

    try {
      const cardType = basics.cardType || 'character';
      let prompt = altGreetingPrompt(
        card.description,
        card.alternate_greetings,
        scenarioHint,
        cardType
      );
      if (tone) {
        prompt = applyTone(prompt, tone);
      }

      const result = await callAIStream(prompt, handleProgress);
      addAltGreeting(result);
      return result;
    } catch (err) {
      setError(`Failed to generate greeting: ${err.message}`);
      return null;
    } finally {
      setLoadingState('altGreeting', false);
    }
  }, [card.description, card.alternate_greetings, basics.cardType, addAltGreeting, setLoadingState, handleProgress]);

  /**
   * Generate tags from description
   */
  const generateTags = useCallback(async () => {
    if (!card.description) {
      setError('Please generate or write a description first');
      return null;
    }

    setLoadingState('tags', true);
    setError(null);

    try {
      const cardType = basics.cardType || 'character';
      const prompt = tagsPrompt(card.description, cardType);
      const result = await callAIStream(prompt, handleProgress);

      // Parse comma-separated tags
      const tags = result
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      setTags(tags);
      return tags;
    } catch (err) {
      setError(`Failed to generate tags: ${err.message}`);
      return null;
    } finally {
      setLoadingState('tags', false);
    }
  }, [card.description, basics.cardType, setTags, setLoadingState, handleProgress]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if any generation is in progress
   */
  const isGenerating = Object.values(loading).some(Boolean);

  return {
    // Loading states
    loading,
    isGenerating,
    wordCount,
    streamStatus,

    // Error handling
    error,
    clearError,

    // Generation functions
    generateDescription,
    generateFirstMessage,
    generateAltGreeting,
    generateTags,
  };
}

export default useAIGeneration;
