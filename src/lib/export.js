/**
 * Export functions for character card formats
 */

/**
 * Export card data as chara_card_v2 JSON
 * @param {Object} card - The card data
 * @returns {Object} Formatted v2 card object
 */
export function toCharaCardV2(card) {
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: {
      name: card.name || '',
      description: card.description || '',
      personality: card.personality || '',
      first_mes: card.first_mes || '',
      avatar: card.avatar || '',
      mes_example: card.mes_example || '',
      scenario: card.scenario || '',
      creator_notes: card.creator_notes || '',
      system_prompt: card.system_prompt || '',
      post_history_instructions: card.post_history_instructions || '',
      alternate_greetings: card.alternate_greetings || [],
      tags: card.tags || [],
      creator: card.creator || '',
      character_version: card.character_version || 'main',
      extensions: card.extensions || {
        depth_prompt: {
          depth: 0,
          prompt: '',
        },
      },
      character_book: card.character_book || null,
    },
  };
}

/**
 * Download card as JSON file
 * @param {Object} card - The card data
 * @param {string} filename - Optional custom filename
 */
export function downloadAsJSON(card, filename = null) {
  const v2Card = toCharaCardV2(card);
  const json = JSON.stringify(v2Card, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${card.name || 'character'}_spec_v2.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export card as PNG with embedded data (future)
 * Requires canvas manipulation and PNG chunk editing
 * @param {Object} card - The card data
 * @param {string} imageUrl - Base image URL
 */
export async function downloadAsPNG(card, imageUrl) {
  // TODO: Implement PNG export with tEXt chunk containing card data
  // This requires:
  // 1. Load image to canvas
  // 2. Get canvas as PNG blob
  // 3. Parse PNG and inject tEXt chunk with base64 card JSON
  // 4. Download modified PNG
  throw new Error('PNG export not yet implemented');
}

export default {
  toCharaCardV2,
  downloadAsJSON,
  downloadAsPNG,
};
