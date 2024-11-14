import * as React from 'react';
import { useState } from 'react';
import { IMIMEType_Valid } from './fps-FileDropTypes';

interface IFileDropBoxProps {
  fileTypes?: IMIMEType_Valid[];  // Accepted MIME types (optional)
  setParentFilesData: (files: File[]) => void;  // Callback to update parent with files
  style?: React.CSSProperties;  // Optional: Custom styling for the component
}

const FileDropBox: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style }) => {
  const [dragging, setDragging] = useState<boolean>(false);  // Track if files are being dragged over the box
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invalidFiles, setInvalidFiles] = useState<File[]>([]);  // Track invalid files

  // Handle the files when dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);  // Reset dragging state

    // Extract files from the event
    const files = e.dataTransfer.files;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleFiles(files);
  };

  // Handle files dropped or selected
  const handleFiles = (files: FileList): void => {
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    // Validate the file types if a fileTypes prop is passed
    if (fileTypes) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (fileTypes.indexOf(file.type as IMIMEType_Valid) === -1) {  // Use indexOf instead of includes
          invalidFiles.push(file);
        } else {
          validFiles.push(file);
        }
      }
    }

    if (validFiles.length > 0) {
      setParentFilesData(validFiles);  // Pass valid files to the parent component
    }

    if (invalidFiles.length > 0) {
      setInvalidFiles(invalidFiles);  // Track invalid files for feedback
      setErrorMessage('Some files are of invalid type.');
    } else {
      setErrorMessage(null);  // Clear error if all files are valid
    }
  };

  // Handle the drag over event to allow drop and set the dragging state
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();  // Prevent the default handling of the event
    setDragging(true);   // Set dragging state to true when files are over the drop zone
  };

  // Handle when drag leaves the area
  const handleDragLeave = (): void => {
    setDragging(false);  // Reset dragging state when drag leaves the drop zone
  };

  return (
    <div
      className={`file-drop-box ${dragging ? 'dragging' : ''}`}  // Add 'dragging' class if files are over the box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      style={style}
    >
      <div>
        <p>Drag and drop files here</p>
        {fileTypes && <p><strong>Accepted file types: </strong>{fileTypes}</p>}
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {invalidFiles.length > 0 && (
          <div style={{ color: 'red' }}>
            <strong>Rejected Files:</strong>
            <ul>
              {invalidFiles.map((file, index) => (
                <li key={index}>{file.name} - {file.type}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
      >
        Choose files
      </button>
    </div>
  );
};

export default FileDropBox;
