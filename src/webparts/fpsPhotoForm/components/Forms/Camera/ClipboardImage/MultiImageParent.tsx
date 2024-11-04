
import * as React from 'react';
import { useState, useCallback } from 'react';

const sampleImageUrl: string = `https://fuzzypawstech.sharepoint.com/sites/PhotoFormWebpart/MapImages/888Mashup/screenshot_2024-10-18T05-55-20-479Z_Nether_X34324_Y43234_Z23110_Desert_Jungle_Snow_Ocean_Trials_Nether%20Portal_Wreck_asdas.png`;
const sampleImageUrlBad: string = `https://fuzzypawstech.sharepoint.com/sites/PhotoFormWebpart/MapImages/888Mashup/screenshot_2024-10-18T05-55-20-479Z_Nether_X34324_Y43234_Z231BAD10_Desert_Jungle_Snow_Ocean_Trials_Nether%20Portal_Wreck_asdas.png`;
import ImagePaste from './ImagePaste'; // Adjust the import path as needed

const ParentForm: React.FC = () => {
  const [images, setImages] = useState<string[]>([ // originally was:  Array(6).fill(null) for 6 null values
    null,
    null,
    sampleImageUrl, // Assign the sample URL to the third index
    null,
    sampleImageUrlBad,
    null
  ]); // Initialize with null for 6 components

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
        <ImagePaste key={index} setParentImageData={setParentImageData(index)} imageUrl={image} />
      ))}
    </div>
  );
};

export default ParentForm;
