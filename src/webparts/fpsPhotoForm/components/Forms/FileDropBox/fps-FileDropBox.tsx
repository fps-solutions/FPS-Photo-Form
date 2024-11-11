// fps-FileDropBox.tsx

import * as React from 'react';
import { useState } from 'react';

// FileDropBox Component Props Interface
export interface IFileDropBoxProps {
  fileTypes?: string;  // Optional prop to restrict accepted file types (e.g., 'image/png, image/jpeg')
  setParentFilesData: (files: File[]) => void;  // Callback to send files back to parent
  inputName?: string;  // Optional input name for the file input element
  style?: React.CSSProperties;  // Optional custom styles for the drop box container
}

// FileDropBox Component
const FileDropBox: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, inputName, style }) => {
  const [fileList, setFileList] = useState<File[]>([]);  // State to hold the current list of files

  // Validate and filter files based on the accepted file types
  const validateFiles = (newFiles: File[]) => {
    if (!fileTypes) return newFiles;  // If no fileTypes prop, return all files
    const acceptedTypes = fileTypes.split(',').map(type => type.trim());  // Parse the file types string
    return newFiles.filter(file => {
      // Use indexOf instead of includes to check file types
      return acceptedTypes.indexOf(file.type) !== -1;  // Check if the file type is in the acceptedTypes list
    });
  };

  // Handle file drop event
  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();  // Prevent the default browser behavior (e.g., opening files)
    const droppedFiles = Array.from(event.dataTransfer.files);  // Get the dropped files from the event
    const validatedFiles = validateFiles(droppedFiles);  // Validate the dropped files
    setFileList(validatedFiles);  // Update local file list with validated files
    setParentFilesData(validatedFiles);  // Pass the validated files back to the parent
  };

  // Handle file selection via file input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];  // Get selected files
    const validatedFiles = validateFiles(selectedFiles);  // Validate the selected files
    setFileList(validatedFiles);  // Update local file list with validated files
    setParentFilesData(validatedFiles);  // Pass the validated files back to the parent
  };

  // Allow drag-and-drop events
  const allowDragOver = (event: React.DragEvent) => {
    event.preventDefault();  // Allow drop
  };

  return (
    <div
      className="file-drop-box"
      style={style}
      onDrop={handleFileDrop}  // Handle file drop event
      onDragOver={allowDragOver}  // Allow drag over event
    >
      <p>Drag and drop files here, or click to select files.</p>
      <input
        type="file"
        name={inputName}
        multiple  // Allow multiple file selection
        onChange={handleFileSelect}  // Handle file selection
      />
      <div className="file-list">
        {fileList.map((file, index) => (
          <div key={index}>{file.name}</div>  // Display file names in the list
        ))}
      </div>
    </div>
  );
};

export default FileDropBox;
