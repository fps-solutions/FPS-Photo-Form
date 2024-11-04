
import * as React from 'react';
import { useState, useEffect } from 'react';
import { handleImagePaste } from '../../functions/handlePasteImage';

import './ImagePaste.css'; // Import the CSS file

interface ImagePasteProps {
  setParentImageData: (data: string | null) => void; // Callback to parent
}

const ImagePaste: React.FC<ImagePasteProps> = ({ setParentImageData }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleClipboard = (e: ClipboardEvent): void => {
    handleImagePaste(e, setImageData);
  };

  useEffect(() => {
    // Only call if imageData changes
    if (imageData !== null) {
      setParentImageData(imageData);
    }
  }, [imageData,]); // Dependency on imageData

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);

  return (
    <div
      tabIndex={0}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPaste={handleClipboard as any}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`image-paste-box ${isFocused ? 'focused' : ''}`}
    >
      {imageData ? (
        <img src={imageData} alt="Pasted" className="image-preview" />
      ) : (
        <span className="placeholder-text">Paste image here</span>
      )}
    </div>
  );
};

export default ImagePaste;