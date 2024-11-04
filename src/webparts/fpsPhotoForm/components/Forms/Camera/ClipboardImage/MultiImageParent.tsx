
import * as React from 'react';
import { useState, useCallback } from 'react';

import ImagePaste from './ImagePaste'; // Adjust the import path as needed

const ParentForm: React.FC = () => {
  const [images, setImages] = useState<string[]>(Array(6).fill(null)); // Initialize with null for 6 components

  const setParentImageData = useCallback((index: number) => {
    return (data: string | null) => {
      setImages((prevImages) => {
        const newImages = [...prevImages]; // Create a new array based on the previous state
        newImages[index] = data; // Update specific index with the new image data
        return newImages; // Return the new array
      });
    };
  }, []); // No dependencies to avoid infinite loops

  const count = images.filter( x => x !== null ).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <h2>{ count } images in state</h2>
      {images.map((image, index) => (
        <ImagePaste key={index} setParentImageData={setParentImageData(index)} />
      ))}
    </div>
  );
};

export default ParentForm;
