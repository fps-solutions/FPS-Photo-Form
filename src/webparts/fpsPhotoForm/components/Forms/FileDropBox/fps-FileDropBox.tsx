import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { getMIMETypesFromObjects, getMIMETypesProp, IMIMEType_Valid, } from './fps-FileDropTypes';
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";
import { createFileElementList } from './fps-FileDropBoxElements';
import { IFileDropBoxProps } from './IFileDropBoxProps';

// https://github.com/fps-solutions/FPS-Photo-Form/issues/89
// require('@mikezimm/fps-styles/dist/fps-FileDrop.css');
require('./fps-FileDrop.css');

/***
 *    .d8888. d888888b  .d8b.  d8888b. d888888b      db   db  .d88b.   .d88b.  db   dD
 *    88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~'      88   88 .8P  Y8. .8P  Y8. 88 ,8P'
 *    `8bo.      88    88ooo88 88oobY'    88         88ooo88 88    88 88    88 88,8P
 *      `Y8b.    88    88~~~88 88`8b      88         88~~~88 88    88 88    88 88`8b
 *    db   8D    88    88   88 88 `88.    88         88   88 `8b  d8' `8b  d8' 88 `88.
 *    `8888Y'    YP    YP   YP 88   YD    YP         YP   YP  `Y88P'   `Y88P'  YP   YD
 *
 *
 */

const FileDropBox: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, maxUploadCount, fileMaxSize =100000, refreshId, resetId,  useDropBox }) => {
  const [ fileMIMETypes, setFileMIMETypes ] = useState<IMIMEType_Valid[]> ( getMIMETypesFromObjects( fileTypes ) );
  const [ fileMIMELabels, setFileMIMELabels ] = useState<string[]> (getMIMETypesProp( fileTypes, 'name' ) );
  const [dragging, setDragging] = useState<boolean>(false);  // Track if files are being dragged over the box
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invalidFiles, setInvalidFiles] = useState<File[]>([]);  // Track invalid files

  // Use a ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /***
   *    db    db .d8888. d88888b      d88888b d88888b d88888b d88888b  .o88b. d888888b
   *    88    88 88'  YP 88'          88'     88'     88'     88'     d8P  Y8 `~~88~~'
   *    88    88 `8bo.   88ooooo      88ooooo 88ooo   88ooo   88ooooo 8P         88
   *    88    88   `Y8b. 88~~~~~      88~~~~~ 88~~~   88~~~   88~~~~~ 8b         88
   *    88b  d88 db   8D 88.          88.     88      88      88.     Y8b  d8    88
   *    ~Y8888P' `8888Y' Y88888P      Y88888P YP      YP      Y88888P  `Y88P'    YP
   *
   *
   */

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    handleClear();
  }, [resetId]);

  useEffect(() => {
    setFileMIMETypes( getMIMETypesFromObjects( fileTypes ) );
    setFileMIMELabels( getMIMETypesProp( fileTypes, 'name' ) );
  }, [fileTypes]);

  // if ( useDropBox === false ) return undefined;

  /***
 *    db   db  .d8b.  d8b   db d8888b. db      d88888b       .o88b. db      d888888b  .o88b. db   dD .d8888.
 *    88   88 d8' `8b 888o  88 88  `8D 88      88'          d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 88'  YP
 *    88ooo88 88ooo88 88V8o 88 88   88 88      88ooooo      8P      88         88    8P      88,8P   `8bo.
 *    88~~~88 88~~~88 88 V8o88 88   88 88      88~~~~~      8b      88         88    8b      88`8b     `Y8b.
 *    88   88 88   88 88  V888 88  .8D 88booo. 88.          Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. db   8D
 *    YP   YP YP   YP VP   V8P Y8888D' Y88888P Y88888P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD `8888Y'
 *
 *
 */

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

/***
 *    d88888b d888888b d8b   db  .d8b.  db           d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b
 *    88'       `88'   888o  88 d8' `8b 88           88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~'
 *    88ooo      88    88V8o 88 88ooo88 88           88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88
 *    88~~~      88    88 V8o88 88~~~88 88           88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88
 *    88        .88.   88  V888 88   88 88booo.      88.     88booo. 88.     88  88  88 88.     88  V888    88
 *    YP      Y888888P VP   V8P YP   YP Y88888P      Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP
 *
 *
 */

  console.log( `UploadStatus:  FileDropBox ~ 88` );
  return (
    <div
      className={`file-drop-box ${dragging ? 'dragging' : ''}`}  // Add 'dragging' class if files are over the box
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      style={{ ...style, ...{ display: useDropBox !== true ? 'none' : 'block' }}}
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
        ref={fileInputRef} // Attach the ref here
        type="file"
        multiple={ maxUploadCount === 1 ? false : true }
        onChange={(e) => e.target.files ? handleFiles(e.target.files) : null}
        style={{ display: 'none' }}
      />
      {/* NOTE:  NEED TO ADD the type='button' on these to prevent any parent component form.onSubmit actions */}
      <button type='button' onClick={() => fileInputRef.current?.click()}>Choose files</button>
      <button type='button' onClick={ handleClear } className='reset' style={{ marginLeft: '2em' }}>Clear files</button>
    </div>
  );
};

export default FileDropBox;
