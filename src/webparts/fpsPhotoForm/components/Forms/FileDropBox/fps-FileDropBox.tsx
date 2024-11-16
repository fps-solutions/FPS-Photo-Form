import * as React from 'react';
import { useState } from 'react';
import { getMIMEObjectPropFromType, getMIMETypesFromObjects, getMIMETypesProp, IMIMEType_Specific, IMIMEType_Valid, IMIMETypesObject } from './fps-FileDropTypes';
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";

// https://github.com/fps-solutions/FPS-Photo-Form/issues/89
// require('@mikezimm/fps-styles/dist/fps-FileDrop.css');
require('./fps-FileDrop.css');

export interface IFileDropBoxProps {
  maxCount?: number; // Default 10
  KBmax?: number; // Max file size in kb
  KBwarn?: number; // Warn file size in kb
  fileTypes?: IMIMETypesObject[];  // Accepted MIME types (optional)
  // fileTypes?: IMIMEType_Valid[];  // Accepted MIME types (optional)
  setParentFilesData: (files: File[]) => void;  // Callback to update parent with files
  style?: React.CSSProperties;  // Optional: Custom styling for the component
}

const FileDropBox: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, maxCount, KBmax =100000, }) => {
  const [ fileMIMETypes, setFileMIMETypes ] = useState<IMIMEType_Valid[]> (getMIMETypesFromObjects( fileTypes ) );
  const [ fileMIMELabels, setFileMIMELabels ] = useState<string[]> (getMIMETypesProp( fileTypes, 'name' ) );
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

  const handleClear = (): void => {
    setInvalidFiles([]);  // Track invalid files for feedback
    setErrorMessage(null);
    setParentFilesData(null);  // Pass valid files to the parent component
  }

  // Handle files dropped or selected
  const handleFiles = (files: FileList): void => {
    const validFiles: File[] = [];

    // https://github.com/fps-solutions/FPS-Photo-Form/issues/88 - retain invalidFiles in history
    const currentInvalidFiles: File[] = invalidFiles;
    const invalidNames: string[] = invalidFiles.map( file => { return file.name } );

    // Validate the file types if a fileTypes prop is passed
    if (fileMIMETypes) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (fileMIMETypes.indexOf(file.type as IMIMEType_Valid) === -1 || file.size > KBmax * 1000 ) {  // Use indexOf instead of includes
          // https://github.com/fps-solutions/FPS-Photo-Form/issues/88 - retain invalidFiles in history
          if ( invalidNames.indexOf( file.name ) < 0 ) { currentInvalidFiles.push(file); invalidNames.push(file.name);  }
        } else {
          validFiles.push(file);
        }
      }
    }

    if (validFiles.length > 0) {
      setParentFilesData(validFiles);  // Pass valid files to the parent component
    }

    if (currentInvalidFiles.length > 0) {
      setInvalidFiles(currentInvalidFiles);  // Track invalid files for feedback
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

  console.log( `UploadStatus:  FileDropBox ~ 88` );
  return (
    <div
      className={`file-drop-box ${dragging ? 'dragging' : ''}`}  // Add 'dragging' class if files are over the box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      style={style}
    >
      <div className={ `file-drop-box-area` } style={{}}>
        <p>Drag and drop files here { KBmax ? `< ${ getSizeLabel( KBmax * 1000 ) } each` : '' }</p>
        {fileMIMELabels && <p><strong>Accepted file types: </strong>{fileMIMELabels.join(' | ')}</p>}
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {invalidFiles.length > 0 && (
          <div style={{ color: 'red' }}>
            <strong>Rejected Files: ( {invalidFiles.length} )</strong>
            <ul>
              {invalidFiles.map((file, index) => (
                <li key={index}>{file.name} - { getMIMEObjectPropFromType( file.type as IMIMEType_Specific, 'name', 'fileType' ) } { file.size > KBmax * 1000 ? <span style={{ color: 'red', fontWeight: 600 }}>{ getSizeLabel( file.size ) }</span> : '' }</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <input
        type="file"
        multiple={ maxCount === 1 ? false : true }
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />
      <button onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>Choose files</button>
      <button onClick={ handleClear } className='reset' style={{ marginLeft: '2em' }}>Clear files</button>
    </div>
  );
};

export default FileDropBox;
