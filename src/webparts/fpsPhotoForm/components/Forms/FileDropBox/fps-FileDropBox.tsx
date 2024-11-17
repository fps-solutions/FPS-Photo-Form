import * as React from 'react';
import { useState, useEffect } from 'react';
import { getMIMEObjectPropFromType, getMIMEObjectsFromSelectedTypes, getMIMETypesFromObjects, getMIMETypesProp, IMIMEType_Specific, IMIMEType_Valid, IMIMETypesObject, Specific_MIME_DropdownOptions, Specific_MIME_Objects } from './fps-FileDropTypes';
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";
import { makeid } from '../../../fpsReferences';
import { createFileElementList } from './fps-FileDropBoxElements';

// https://github.com/fps-solutions/FPS-Photo-Form/issues/89
// require('@mikezimm/fps-styles/dist/fps-FileDrop.css');
require('./fps-FileDrop.css');

export interface IFileDropBoxWPProps {
  defaultPasteMode?: boolean;
  maxUploadCount?: string; // Default 10
  fileMaxSize?: string; // Max file size in kb
  fileWarnSize?: string; // Warn file size in kb
  fileTypes?: string[];  // Accepted MIME types (optional)
}

export const FileSizeScaleOptions: string[] = ['KB', 'MB', 'GB', 'TB'];
export const FileSizeScaleRegex: RegExp = /^(\d+(\.\d+)?)\s*(KB|MB|GB|TB)$/i;

export function convertFileSizeStringToNum(fileSize: string = '' ): number {

  // Extract the numeric part and the unit part (KB, MB, GB, TB, etc.)
  const match = fileSize.trim().match(FileSizeScaleRegex);

  if ( !match ) return parseInt( fileSize );

  const numValue = parseFloat(match[1]);
  const unit = match[3].toUpperCase();

  // Find the index of the scale unit
  const index = FileSizeScaleOptions.indexOf(unit);

  if (index === -1) {
    throw new Error("Unsupported unit");
  }

  // Return the number converted to bytes
  return numValue * Math.pow(1024, index + 1);
}

export function convertFileDropWPPropsToFileDropBoxProps( properties: IFileDropBoxWPProps ): IFileDropBoxProps {
  const result: IFileDropBoxProps = {
    setParentFilesData: null,
    fileTypes: [],
    refreshId: makeid(5),
    useDropBox: true,
  };
  const { maxUploadCount, fileMaxSize, fileWarnSize, fileTypes, defaultPasteMode } = properties;
  if ( maxUploadCount ) result.maxUploadCount = parseInt( maxUploadCount );
  if ( fileMaxSize ) result.fileMaxSize = convertFileSizeStringToNum( fileMaxSize );
  if ( fileWarnSize ) result.fileWarnSize = convertFileSizeStringToNum( fileWarnSize );
  if ( defaultPasteMode === true ) result.useDropBox = false;
  if ( fileTypes && fileTypes.length > 0 ) {
    result.fileTypes = getMIMEObjectsFromSelectedTypes( Specific_MIME_Objects, properties.fileTypes );
  }
  return result;
}

export interface IFileDropBoxProps {
  useDropBox?: boolean;
  maxUploadCount?: number; // Default 10
  fileMaxSize?: number; // Max file size in kb
  fileWarnSize?: number; // Warn file size in kb
  fileTypes?: IMIMETypesObject[];  // Accepted MIME types (optional)
  // fileTypes?: IMIMEType_Valid[];  // Accepted MIME types (optional)
  setParentFilesData: (files: File[]) => void;  // Callback to update parent with files
  style?: React.CSSProperties;  // Optional: Custom styling for the component
  refreshId?: string;
}

const FileDropBox: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, maxUploadCount, fileMaxSize =100000, refreshId, useDropBox }) => {
  const [ fileMIMETypes, setFileMIMETypes ] = useState<IMIMEType_Valid[]> ( getMIMETypesFromObjects( fileTypes ) );
  const [ fileMIMELabels, setFileMIMELabels ] = useState<string[]> (getMIMETypesProp( fileTypes, 'name' ) );
  const [dragging, setDragging] = useState<boolean>(false);  // Track if files are being dragged over the box
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invalidFiles, setInvalidFiles] = useState<File[]>([]);  // Track invalid files

  // useEffect(() => {
  //   // Intentionally left empty
  // }, [maxUploadCount, fileMaxSize, errorMessage]);

  useEffect(() => {
    setFileMIMETypes( getMIMETypesFromObjects( fileTypes ) );
    setFileMIMELabels( getMIMETypesProp( fileTypes, 'name' ) );
  }, [fileTypes]);

  if ( useDropBox === false ) return undefined;

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
    let currentInvalidFiles: File[] = invalidFiles;
    let invalidNames: string[] = invalidFiles.map( file => { return file.name } );

    // Validate the file types if a fileTypes prop is passed
    if (fileMIMETypes) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (fileMIMETypes.indexOf(file.type as IMIMEType_Valid) === -1 || file.size > fileMaxSize ) {  // Use indexOf instead of includes
          // https://github.com/fps-solutions/FPS-Photo-Form/issues/88 - retain invalidFiles in history
          const invalidIdx = invalidNames.indexOf( file.name );
          if ( invalidIdx > -1 ) {
            currentInvalidFiles = currentInvalidFiles.filter((_, i) => i !== invalidIdx);
            invalidNames = invalidNames.filter((_, i) => i !== invalidIdx);
          }
          currentInvalidFiles.unshift(file); invalidNames.unshift(file.name);
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
    if ( validFiles.length === 0 ) setParentFilesData(validFiles);
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
        <p>Drag and drop files here { fileMaxSize ? `< ${ getSizeLabel( fileMaxSize ) } each` : '' }</p>
        {fileMIMELabels && <p><strong>Accepted file types: </strong>{fileMIMELabels.join(' | ')}</p>}
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {invalidFiles.length > 0 && (
          <div style={{ color: 'red' }}>
            <strong>Rejected Files: ( {invalidFiles.length} )</strong>
            { createFileElementList( invalidFiles, fileMaxSize, undefined, false, false ) }
          </div>
        )}
      </div>

      <input
        type="file"
        multiple={ maxUploadCount === 1 ? false : true }
        onChange={(e) => e.target.files ? handleFiles(e.target.files) : null}
        style={{ display: 'none' }}
      />
      <button onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}>Choose files</button>
      <button onClick={ handleClear } className='reset' style={{ marginLeft: '2em' }}>Clear files</button>
    </div>
  );
};

export default FileDropBox;
