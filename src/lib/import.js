/**
 * Import/parse functions for character cards
 */

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
 * @param {File} file - File object from input
 * @returns {Promise<Object>} Parsed card data
 */
export function readCardFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = parseCharaCard(event.target.result);
        resolve(result);
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
 * Extract card data from PNG file (future)
 * @param {File} file - PNG file
 * @returns {Promise<Object>} Parsed card data
 */
export async function readCardFromPNG(file) {
  // TODO: Implement PNG parsing
  // 1. Read file as ArrayBuffer
  // 2. Parse PNG chunks
  // 3. Find tEXt chunk with 'chara' keyword
  // 4. Base64 decode the value
  // 5. Parse as JSON
  throw new Error('PNG import not yet implemented');
}

export default {
  parseCharaCard,
  readCardFile,
  readCardFromPNG,
};
