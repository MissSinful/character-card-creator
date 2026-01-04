/**
 * Export functions for character card formats
 */

import { embedCardInPNG, convertToPNG } from './png';

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
 * Export card as PNG with embedded data
 * @param {Object} card - The card data
 * @param {string} imageDataUrl - Image as data URL (or null to use placeholder)
 * @param {string} filename - Optional custom filename
 */
export async function downloadAsPNG(card, imageDataUrl = null, filename = null) {
  const v2Card = toCharaCardV2(card);

  // If no image provided, create a placeholder
  let pngBuffer;
  if (imageDataUrl) {
    // Convert provided image to PNG
    pngBuffer = await convertToPNG(imageDataUrl, 512);
  } else {
    // Create a placeholder image with the character's initial
    pngBuffer = await createPlaceholderPNG(card.name || 'C');
  }

  // Embed card data in PNG
  const pngWithData = embedCardInPNG(pngBuffer, v2Card);

  // Download
  const blob = new Blob([pngWithData], { type: 'image/png' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${card.name || 'character'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create a placeholder PNG with character initial
 * @param {string} name - Character name
 * @returns {Promise<ArrayBuffer>}
 */
async function createPlaceholderPNG(name) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#7c3aed');
  gradient.addColorStop(1, '#4f46e5');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Character initial
  const initial = (name[0] || 'C').toUpperCase();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 200px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, size / 2, size / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create placeholder PNG'));
        return;
      }
      blob.arrayBuffer().then(resolve).catch(reject);
    }, 'image/png');
  });
}

export default {
  toCharaCardV2,
  downloadAsJSON,
  downloadAsPNG,
};
