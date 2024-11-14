
/**
 * 2024-11-04:  Migrated from PhotoFormWebpart
 *
 */

import * as React from 'react';
import { useState, useEffect } from 'react';
import { handleImagePaste } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/ClipboardImage/handlePasteImage';

require('@mikezimm/fps-styles/dist/fps-ImagePaste.css');

export interface IImagePasteProps {
  // eslint-disable-next-line @rushstack/no-new-null
  setParentImageData: (data: string | null) => void; // Callback to parent
  clearId?: string;  // Added to fix clearing the image https://github.com/fps-solutions/FPS-Photo-Form/issues/80
  viewOnly?:  boolean;
  imageUrl?: string; // Optional image URL to check
  imageBoxCSS?: React.CSSProperties;
  imageBoxClassName?: string;
  imageCSS?: React.CSSProperties; // Best location to set the component size and like: { height: '100px', width: '100px', objectFilt: '[ cover | contain ]' }
}

const defaultImageCSS: React.CSSProperties = { objectFit: 'contain', width: '100%', height: '100%'};

const ImagePaste: React.FC<IImagePasteProps> = ({ setParentImageData, clearId, imageUrl, imageBoxCSS = {}, imageBoxClassName='', imageCSS={}, viewOnly = false }) => {
  const [imageData, setImageData] = useState<string | null>(null);
  const [existed, setExisted] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [clearIdX, setClearIdX] = useState(clearId);
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
        setExisted( imageUrl && imageUrl.indexOf('http') === 0 ? true : false );
      };

      img.onerror = () => {
        setLoading(false); // Stop loading, allow pasting
        // setExisted( false );
      };
    } else {
      setLoading(false); // If no URL is provided, allow pasting immediately
      // setExisted(false); // If no URL is provided, allow pasting immediately
    }
  }, [imageUrl]);

  /**
   * Added to fix clearing the image https://github.com/fps-solutions/FPS-Photo-Form/issues/80
   */
  useEffect(() => {
    setIsFocused( false );
    setImageData(null); // Set the imageData if the image loads successfully
    setLoading(false); // If no URL is provided, allow pasting immediately
    setClearIdX( clearId );
    // setExisted( false );
  }, [clearId, clearIdX ]);

  useEffect(() => {
    if (imageData !== null && imageData !== imageUrl ) {
      setParentImageData(imageData); // Update parent only if imageData is not null
    }
  }, [imageData, setParentImageData]);

  const handleFocus = (): void => setIsFocused(true);
  const handleBlur = (): void => setIsFocused(false);

  // Reset the component and clear image data
  const handleClearImage = () => {
    setImageData(null);
    setParentImageData(null);
    setClearIdX(undefined); // Optional: reset clearIdX if necessary
    setExisted( false );
  };

  let title = ``;
  let showFetched: boolean = false;  // https://github.com/fps-solutions/FPS-Photo-Form/issues/75
  if ( loading ) {
    title=`Attempting to load image ${imageUrl}`;
  } else if ( !loading && !imageUrl && !imageData) {
    title=`Copy image to clipboard, select this and paste!`;
  } else {
    if ( !imageData && imageUrl ) { title =  `Double check url: ${imageUrl}`; }
    else if ( imageData && imageData !== imageUrl ) { title = 'Pasted image'; }
    else if ( imageData === imageUrl ) {
      showFetched = imageData.indexOf('data') === 0 ? false : true;
      title = showFetched === true ? 'Image fetched' : 'Image pasted';
    }
  }
  // https://github.com/fps-solutions/FPS-Photo-Form/issues/75
  const showFetchedCSS: React.CSSProperties = showFetched ? { borderStyle: 'dashed' } : {};

  return (
    <div
      tabIndex={0}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onPaste={handleClipboard as any}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`image-paste-box ${isFocused ? 'focused' : ''} ${ imageBoxClassName }`}
      style={{ ...imageBoxCSS, ...showFetchedCSS }}
      title={ title }
    >
      {loading ? (
        <span>Loading...</span> // Show loading message while checking URL
      ) : imageData ? (
        <div style={{ position: 'relative' }}>
          <img src={imageData} alt="Pasted" className="image-preview" style={{ ...defaultImageCSS, ...imageCSS }} />
          {/* Clear Button */}
          { existed ? null : <button
            onClick={ existed ? null : handleClearImage }
            disabled={ existed ? true : false }
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '50%',
              width: '2.25em',
              height: '2.25em',
              fontSize: '14px',
              color: '#333',
              cursor: existed ? null : 'pointer',
              zIndex: 10,
              padding: '0px', // Added this when using trash icon
            }}
            title={ existed === true ? 'Unable to paste over image' : "Clear Image" }
          >🗑️</button> }
        </div>
      ) : (
        <div style={{ display: 'block' }}>
          { viewOnly ? undefined : <div className="placeholder-text">Paste image here</div> }
          { imageUrl ? <div className="placeholder-text">Nothing found at Url</div> : undefined }
        </div>
      )}
    </div>
  );
};

export default ImagePaste;