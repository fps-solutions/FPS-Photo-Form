
// ParentComponent.tsx

import * as React from 'react';
import { useState } from 'react';
import FileDropContainer from './fps-FileDropContainer';

const ParentComponent: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpdate = (updatedFiles: File[]) => {
    setFiles(updatedFiles);
  };

  return (
    <div>
      <h2>File Upload Demo</h2>
      <FileDropContainer
        fileTypes="image/png, image/jpeg"  // Accept only PNG and JPEG files
        onFileUpdate={handleFileUpdate}  // Callback to receive file updates
      />
      <div>
        <h3>Uploaded Files:</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ParentComponent;
