/**
 * PNG chunk utilities for embedding/extracting character card data
 * PNG files store data in chunks, we use the tEXt chunk with keyword "chara"
 */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * CRC32 lookup table for PNG chunk checksums
 */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

/**
 * Calculate CRC32 for a data array
 */
function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Read a 4-byte big-endian unsigned integer
 */
function readUint32(data, offset) {
  return (
    (data[offset] << 24) |
    (data[offset + 1] << 16) |
    (data[offset + 2] << 8) |
    data[offset + 3]
  ) >>> 0;
}

/**
 * Write a 4-byte big-endian unsigned integer
 */
function writeUint32(value) {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ];
}

/**
 * Parse PNG chunks from raw data
 */
function parseChunks(data) {
  const chunks = [];
  let offset = 8; // Skip PNG signature

  while (offset < data.length) {
    const length = readUint32(data, offset);
    const type = String.fromCharCode(
      data[offset + 4],
      data[offset + 5],
      data[offset + 6],
      data[offset + 7]
    );
    const chunkData = data.slice(offset + 8, offset + 8 + length);
    const crc = readUint32(data, offset + 8 + length);

    chunks.push({ type, data: chunkData, crc });
    offset += 12 + length;
  }

  return chunks;
}

/**
 * Build PNG file from chunks
 */
function buildPNG(chunks) {
  const parts = [new Uint8Array(PNG_SIGNATURE)];

  for (const chunk of chunks) {
    const typeBytes = new Uint8Array([
      chunk.type.charCodeAt(0),
      chunk.type.charCodeAt(1),
      chunk.type.charCodeAt(2),
      chunk.type.charCodeAt(3),
    ]);

    // Length
    parts.push(new Uint8Array(writeUint32(chunk.data.length)));
    // Type
    parts.push(typeBytes);
    // Data
    parts.push(chunk.data);
    // CRC (over type + data)
    const crcData = new Uint8Array(4 + chunk.data.length);
    crcData.set(typeBytes, 0);
    crcData.set(chunk.data, 4);
    parts.push(new Uint8Array(writeUint32(crc32(crcData))));
  }

  // Combine all parts
  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

/**
 * Create a tEXt chunk with keyword and value
 */
function createTextChunk(keyword, value) {
  const keywordBytes = new TextEncoder().encode(keyword);
  const valueBytes = new TextEncoder().encode(value);

  // keyword + null separator + value
  const data = new Uint8Array(keywordBytes.length + 1 + valueBytes.length);
  data.set(keywordBytes, 0);
  data[keywordBytes.length] = 0; // null separator
  data.set(valueBytes, keywordBytes.length + 1);

  return { type: 'tEXt', data };
}

/**
 * Extract tEXt chunk value by keyword
 */
function extractTextChunk(chunks, keyword) {
  for (const chunk of chunks) {
    if (chunk.type === 'tEXt') {
      // Find null separator
      let nullIndex = -1;
      for (let i = 0; i < chunk.data.length; i++) {
        if (chunk.data[i] === 0) {
          nullIndex = i;
          break;
        }
      }

      if (nullIndex > 0) {
        const chunkKeyword = new TextDecoder().decode(chunk.data.slice(0, nullIndex));
        if (chunkKeyword === keyword) {
          return new TextDecoder().decode(chunk.data.slice(nullIndex + 1));
        }
      }
    }
  }
  return null;
}

/**
 * Extract character card data from PNG file
 * @param {ArrayBuffer} buffer - PNG file data
 * @returns {Object|null} Parsed card data or null if not found
 */
export function extractCardFromPNG(buffer) {
  const data = new Uint8Array(buffer);

  // Verify PNG signature
  for (let i = 0; i < 8; i++) {
    if (data[i] !== PNG_SIGNATURE[i]) {
      throw new Error('Not a valid PNG file');
    }
  }

  const chunks = parseChunks(data);
  const charaData = extractTextChunk(chunks, 'chara');

  if (!charaData) {
    return null;
  }

  // Decode base64
  const jsonString = atob(charaData);
  return JSON.parse(jsonString);
}

/**
 * Embed character card data into PNG file
 * @param {ArrayBuffer} buffer - Original PNG file data
 * @param {Object} cardData - Card data to embed
 * @returns {Uint8Array} Modified PNG file data
 */
export function embedCardInPNG(buffer, cardData) {
  const data = new Uint8Array(buffer);

  // Verify PNG signature
  for (let i = 0; i < 8; i++) {
    if (data[i] !== PNG_SIGNATURE[i]) {
      throw new Error('Not a valid PNG file');
    }
  }

  const chunks = parseChunks(data);

  // Remove any existing 'chara' tEXt chunks
  const filteredChunks = chunks.filter(chunk => {
    if (chunk.type !== 'tEXt') return true;
    let nullIndex = -1;
    for (let i = 0; i < chunk.data.length; i++) {
      if (chunk.data[i] === 0) {
        nullIndex = i;
        break;
      }
    }
    if (nullIndex > 0) {
      const keyword = new TextDecoder().decode(chunk.data.slice(0, nullIndex));
      return keyword !== 'chara';
    }
    return true;
  });

  // Create new chara chunk with base64-encoded JSON
  const jsonString = JSON.stringify(cardData);
  const base64Data = btoa(jsonString);
  const charaChunk = createTextChunk('chara', base64Data);

  // Insert chara chunk after IHDR (first chunk)
  const newChunks = [
    filteredChunks[0], // IHDR
    charaChunk,
    ...filteredChunks.slice(1),
  ];

  return buildPNG(newChunks);
}

/**
 * Load image file and return as data URL
 * @param {File} file - Image file
 * @returns {Promise<string>} Data URL
 */
export function loadImageAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
}

/**
 * Load image file as ArrayBuffer
 * @param {File} file - Image file
 * @returns {Promise<ArrayBuffer>}
 */
export function loadImageAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert image (any format) to PNG ArrayBuffer via canvas
 * @param {string} dataUrl - Image as data URL
 * @param {number} maxSize - Max width/height (default 512)
 * @returns {Promise<ArrayBuffer>}
 */
export function convertToPNG(dataUrl, maxSize = 512) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate dimensions (maintain aspect ratio)
      let width = img.width;
      let height = img.height;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height / width) * maxSize);
          width = maxSize;
        } else {
          width = Math.round((width / height) * maxSize);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG'));
          return;
        }
        blob.arrayBuffer().then(resolve).catch(reject);
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export default {
  extractCardFromPNG,
  embedCardInPNG,
  loadImageAsDataURL,
  loadImageAsBuffer,
  convertToPNG,
};
