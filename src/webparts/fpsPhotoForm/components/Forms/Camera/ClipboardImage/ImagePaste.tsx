
import * as React from 'react';
import { useState, useEffect } from 'react';
import { handleImagePaste } from '../../functions/handlePasteImage';

import './ImagePaste.css'; // Import the CSS file

interface ImagePasteProps {
  // eslint-disable-next-line @rushstack/no-new-null
  setParentImageData: (data: string | null) => void; // Callback to parent
  imageUrl?: string; // Optional image URL to check
  imageBoxCSS?: React.CSSProperties;
  imageCSS?: React.CSSProperties; // like: { objectFilt: '[ cover | contain ]' }
}

const ImagePaste: React.FC<ImagePasteProps> = ({ setParentImageData, imageUrl, imageBoxCSS = {}, imageCSS={ objectFit: 'contain', width: '100%', height: '100%'} }) => {
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

  let title = ``;
  if ( loading ) {
    title=`Attempting to load image ${imageUrl}`;
  } else if ( !loading && !imageUrl && !imageData) {
    title=`Copy image to clipboard, select this and paste!`;
  } else {
    if ( !imageData && imageUrl ) { title =  `Double check url: ${imageUrl}`; }
    else if ( imageData && imageData !== imageUrl ) { title = 'Pasted image'; }
    else if ( imageData === imageUrl ) {
      title = imageData.indexOf('data') === 0 ? 'Image pasted' : 'Image fetched';
    }
  }

  return (
    <div
      tabIndex={0}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPaste={handleClipboard as any}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`image-paste-box ${isFocused ? 'focused' : ''}`}
      style={ imageBoxCSS }
      title={ title }
    >
      {loading ? (
        <span>Loading...</span> // Show loading message while checking URL
      ) : imageData ? (
        <img src={imageData} alt="Pasted" className="image-preview" style={ imageCSS } />
      ) : (
        <div style={{ display: 'block' }}>
          <div className="placeholder-text">Paste image here</div>
          { imageUrl ? <div className="placeholder-text">Nothing found at Url</div> : undefined }
        </div>
      )}
    </div>
  );
};

export default ImagePaste;