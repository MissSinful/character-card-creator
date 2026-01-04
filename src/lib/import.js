/**
 * Import/parse functions for character cards
 */

import { extractCardFromPNG, loadImageAsDataURL } from './png';

/**
 * Parse a character card JSON file
 * Handles both v1 and v2 formats
 * @param {string} jsonString - Raw JSON string
 * @returns {Object} Normalized card data
 */
export function parseCharaCard(jsonString) {
  const json = JSON.parse(jsonString);
  
  // Check if it's v2 format (has spec field)
  if (json.spec === 'chara_card_v2' && json.data) {
    return normalizeV2Card(json.data);
  }
  
  // Check if data is nested (some exporters do this)
  if (json.data) {
    return normalizeV1Card(json.data);
  }
  
  // Assume v1 format at root level
  return normalizeV1Card(json);
}

/**
 * Normalize v2 card data
 * @param {Object} data - Raw v2 data object
 * @returns {Object} Normalized card
 */
function normalizeV2Card(data) {
  return {
    name: data.name || '',
    description: data.description || '',
    personality: data.personality || '',
    first_mes: data.first_mes || '',
    avatar: data.avatar || '',
    mes_example: data.mes_example || '',
    scenario: data.scenario || '',
    creator_notes: data.creator_notes || '',
    system_prompt: data.system_prompt || '',
    post_history_instructions: data.post_history_instructions || '',
    alternate_greetings: Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    creator: data.creator || '',
    character_version: data.character_version || 'main',
    extensions: data.extensions || {},
    character_book: data.character_book || null,
  };
}

/**
 * Normalize v1 card data (older format)
 * @param {Object} data - Raw v1 data object
 * @returns {Object} Normalized card
 */
function normalizeV1Card(data) {
  return {
    name: data.name || data.char_name || '',
    description: data.description || data.char_persona || '',
    personality: data.personality || '',
    first_mes: data.first_mes || data.char_greeting || '',
    avatar: data.avatar || data.char_avatar || '',
    mes_example: data.mes_example || data.example_dialogue || '',
    scenario: data.scenario || data.world_scenario || '',
    creator_notes: data.creator_notes || '',
    system_prompt: data.system_prompt || '',
    post_history_instructions: data.post_history_instructions || '',
    alternate_greetings: Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    creator: data.creator || '',
    character_version: data.character_version || 'main',
    extensions: {},
    character_book: null,
  };
}

/**
 * Read a File object and parse as character card
 * Supports both JSON and PNG formats
 * @param {File} file - File object from input
 * @returns {Promise<{card: Object, imageDataUrl?: string}>} Parsed card data and optional image
 */
export async function readCardFile(file) {
  const fileName = file.name.toLowerCase();

  // Handle PNG files
  if (fileName.endsWith('.png') || file.type === 'image/png') {
    return readCardFromPNG(file);
  }

  // Handle JSON files
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = parseCharaCard(event.target.result);
        resolve({ card: result, imageDataUrl: null });
      } catch (error) {
        reject(new Error(`Failed to parse character card: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Extract card data from PNG file
 * @param {File} file - PNG file
 * @returns {Promise<{card: Object, imageDataUrl: string}>} Parsed card data and image
 */
export async function readCardFromPNG(file) {
  // Read file as ArrayBuffer for PNG parsing
  const buffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read PNG file'));
    reader.readAsArrayBuffer(file);
  });

  // Extract card data from PNG
  const rawData = extractCardFromPNG(buffer);

  if (!rawData) {
    throw new Error('No character data found in PNG. Is this a character card?');
  }

  // Normalize the card data
  let card;
  if (rawData.spec === 'chara_card_v2' && rawData.data) {
    card = normalizeV2Card(rawData.data);
  } else if (rawData.data) {
    card = normalizeV1Card(rawData.data);
  } else {
    card = normalizeV1Card(rawData);
  }

  // Also get the image as data URL for display
  const imageDataUrl = await loadImageAsDataURL(file);

  return { card, imageDataUrl };
}

export default {
  parseCharaCard,
  readCardFile,
  readCardFromPNG,
};
