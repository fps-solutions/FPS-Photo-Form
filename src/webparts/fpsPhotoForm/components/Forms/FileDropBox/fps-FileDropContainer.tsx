import * as React from 'react';
import FileDropBox from './fps-FileDropBox';  // Import the FileDropBox component
import { IMIMEType_Valid } from './fps-FileDropTypes';

export interface IFileDropContainerProps {
  fileTypes?: IMIMEType_Valid[];  // Only accepts the specified valid MIME typesOptional prop to restrict accepted file types (e.g., 'image/png, image/jpeg')
  onFileUpdate: (files: File[]) => void;  // Callback to send the updated list of files to the parent component
  style?: React.CSSProperties;  // Optional custom styles for the container
}

const FileUploadContainer: React.FC<IFileDropContainerProps> = ({ fileTypes, onFileUpdate, style }) => {
  const [files, setFiles] = React.useState<File[]>([]);

  // Callback to handle the file data received from FileDropBox
  const handleFileUpdate = (newFiles: File[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onFileUpdate([...files, ...newFiles]);  // Pass the updated list to the parent component
  };

  return (
    <div style={style}>
      <h2>Upload Files</h2>
      <FileDropBox
        fileTypes={fileTypes}  // Pass accepted file types to FileDropBox
        setParentFilesData={handleFileUpdate}  // Pass the handler to FileDropBox
      />
      <div>
        <h3>Uploaded Files:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUploadContainer;
