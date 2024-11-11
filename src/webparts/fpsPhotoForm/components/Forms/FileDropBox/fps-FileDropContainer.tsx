// fps-FileDropContainer.tsx

import * as React from 'react';
import { useState } from 'react';
import FileDropBox from './fps-FileDropBox';

// FileDropContainer Component Props Interface
export interface IFileDropContainerProps {
  fileTypes?: string;  // Optional prop to restrict accepted file types (e.g., 'image/png, image/jpeg')
  onFileUpdate: (files: File[]) => void;  // Callback to send the updated list of files to the parent component
  style?: React.CSSProperties;  // Optional custom styles for the container
}

// FileDropContainer Component
const FileDropContainer: React.FC<IFileDropContainerProps> = ({ fileTypes, onFileUpdate, style }) => {
  const [files, setFiles] = useState<File[]>([]);  // State to manage the list of files

  // Callback to handle file updates from the FileDropBox
  const handleFileUpdates = (newFiles: File[]) => {
    setFiles(newFiles);  // Update the file list state
    onFileUpdate(newFiles);  // Pass the updated files to the parent via the callback
  };

  return (
    <div className="file-drop-container" style={style}>
      <FileDropBox
        fileTypes={fileTypes}  // Pass file types restriction to the child component
        setParentFilesData={handleFileUpdates}  // Pass the callback to handle file updates
      />
      <div className="file-list">
        <h3>Uploaded Files:</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>  // Display the uploaded file names
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default FileDropContainer;
