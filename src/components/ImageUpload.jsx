import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { loadImageAsDataURL } from '../lib/png';

/**
 * Character image upload and preview component
 */
export default function ImageUpload({ imageDataUrl, onImageChange }) {
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
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

    // Reset input
    e.target.value = '';
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange(null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">
        Character Image
      </label>

      <div
        onClick={handleClick}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all
          ${imageDataUrl
            ? 'border-purple-500/50 bg-zinc-800/30'
            : 'border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800/30'
          }
        `}
      >
        {imageDataUrl ? (
          <div className="relative aspect-square max-w-[200px] mx-auto p-2">
            <img
              src={imageDataUrl}
              alt="Character"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-0 right-0 p-1 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-lg"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <ImageIcon className="w-8 h-8 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-400 text-center">
              Click to upload character image
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              PNG, JPG, WebP (max 10MB)
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <p className="text-xs text-zinc-500">
        Used for PNG export. Image will be resized to 512x512.
      </p>
    </div>
  );
}
