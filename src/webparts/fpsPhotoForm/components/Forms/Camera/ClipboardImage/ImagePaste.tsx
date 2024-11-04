
import * as React from 'react';
import { useState, useEffect } from 'react';
import { handleImagePaste } from '../../functions/handlePasteImage';

import './ImagePaste.css'; // Import the CSS file


interface ImagePasteProps {
  setParentImageData: (data: string | null) => void; // Callback to parent
  imageUrl?: string; // Optional image URL to check
}

const ImagePaste: React.FC<ImagePasteProps> = ({ setParentImageData, imageUrl }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleClipboard = (e: ClipboardEvent): void => {
    handleImagePaste(e, setImageData);
  };

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        setImageData(imageUrl); // Set the imageData if the image loads successfully
        setLoading(false); // Stop loading
      };

      img.onerror = () => {
        setLoading(false); // Stop loading, allow pasting
      };
    } else {
      setLoading(false); // If no URL is provided, allow pasting immediately
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageData !== null && imageData !== imageUrl ) {
      setParentImageData(imageData); // Update parent only if imageData is not null
    }
  }, [imageData, setParentImageData]);

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);

  return (
    <div
      tabIndex={0}
      onPaste={handleClipboard as any}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`image-paste-box ${isFocused ? 'focused' : ''}`}
    >
      {loading ? (
        <span>Loading...</span> // Show loading message while checking URL
      ) : imageData ? (
        <img src={imageData} alt="Pasted" className="image-preview" />
      ) : (
        <span className="placeholder-text">Paste image here</span>
      )}
    </div>
  );
};

export default ImagePaste;