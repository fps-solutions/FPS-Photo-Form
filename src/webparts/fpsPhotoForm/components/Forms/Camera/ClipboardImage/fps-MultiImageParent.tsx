
// /**
//  * 2024-11-04:  Migrated from PhotoFormWebpart
//  *
//  */

// import * as React from 'react';
// import { useState, useCallback } from 'react';

// import ImagePaste from './fps-ImagePaste'; // Adjust the import path as needed

// export interface IMultiImagePasteProps {
//   // eslint-disable-next-line @rushstack/no-new-null
//   setParentImageData?: (data: string | null) => void; // Callback to parent
//   imageCount: number;  // Number of paste boxes to start with if none  are preloaded urls
//   elementCSS?: React.CSSProperties;  // CSS for the container of all image paste boxes
//   elementClassName?: string;  // CSS classname for the container of all image paste boxes
//   imageBoxCSS?: React.CSSProperties;
//   imageCSS?: React.CSSProperties;  // Best location to set the component size and like: { height: '100px', width: '100px', objectFilt: '[ cover | contain ]' }
//   preloadImages?: string[];  // Array of either null or urls to preload
// }

// const ParentForm: React.FC<IMultiImagePasteProps> = ( props ) => {
//   const { imageCount, elementCSS = {}, imageBoxCSS = {}, imageCSS, preloadImages, elementClassName } = props;
//   const [images, setImages] = useState<string[]>( preloadImages ? preloadImages :Array(imageCount).fill(null) );

//   const setParentImageData = useCallback((index: number) => {
//     return (data: string | null) => {
//       setImages((prevImages) => {
//         const newImages = [...prevImages]; // Create a new array based on the previous state
//         newImages[index] = data; // Update specific index with the new image data
//         return newImages; // Return the new array
//       });
//     };
//   }, []); // No dependencies to avoid infinite loops

//   const count = images.filter( x => x !== null ).length;

//   return (
//     <div>
//       <div className={ elementClassName } style={ { ...{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }, ...elementCSS }  }>
//         {images.map((image, index) => (
//           <ImagePaste key={index} setParentImageData={setParentImageData(index)} imageUrl={image} imageBoxCSS={ imageBoxCSS } imageCSS={ imageCSS }/>
//         ))}
//       </div>
//       <h2>{ count } images in state</h2>
//     </div>
//   );
// };

// export default ParentForm;
