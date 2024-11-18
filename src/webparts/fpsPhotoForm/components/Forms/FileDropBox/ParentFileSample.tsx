
// ParentComponent.tsx

import * as React from 'react';
import { useState } from 'react';
import FileDropContainer from './fps-FileDropContainer';
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { postSourceFilesAPI } from '@mikezimm/fps-core-v7/lib/restAPIs/lists/files/postSourceFilesAPI';

import { makeid } from '../../../fpsReferences';
import { getSizeLabel } from '@mikezimm/fps-core-v7/lib/logic/Math/labels';
import { IFpsItemsReturn } from '@mikezimm/fps-core-v7/lib/components/molecules/process-results/CheckItemsResults';
import { IFileDropBoxProps } from './IFileDropBoxProps';
import { createFileElementList } from './fps-FileDropBoxElements';

export interface IFileDropContainerParent  {
  FilesSource: ISourceProps;
  fileDropBoxProps: IFileDropBoxProps;
}

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

const ParentComponent: React.FC<IFileDropContainerParent> = ( props ) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus ] = useState( null );
  const [uploadStates, setUploadStates ] = useState<IFpsItemsReturn[]>( [] );

  const totalSize: number = files.reduce((total, file) => total + file.size, 0);

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

  const handleFileUpdate = (updatedFiles: File[]): void => {
    const doReset = updatedFiles === null ? true : false;
    setUploadStates( [] );
    setFiles( doReset ? [] : updatedFiles );
    setUploadStatus( updatedFiles && updatedFiles.length > 0 ? `Success: ${makeid(5)}` : null );
  };


// Define the setParentFilesData function
const saveFilesToLibrary = async (uploadFiles: File[], FileSource: ISourceProps, asBatch: boolean): Promise<void> => {
  // Iterate over each file and upload it to SharePoint
  if ( asBatch === true ) {

    const allReturns = await Promise.all(
      uploadFiles.map( ( file: File, idx: number ) => { return postSourceFilesAPI(FileSource, true, file, file.name, true, true ); } )
    );

    setUploadStates( allReturns );
  } else {

    setUploadStates( [] );
    const liveStats = [];
    let idx = -1;
    for (const file of uploadFiles) {
      try {
        idx ++;
        // Call the uploadImageToLibrary function using each file as a Blob
        const fileUrl = await postSourceFilesAPI(FileSource, true, file, file.name, true, true );
        fileUrl.statusText = `${idx}: ${fileUrl.statusText}`;
        if (fileUrl) {
          console.log(`File uploaded successfully: ${fileUrl}`);
          setUploadStatus( `Success: ${makeid(5)}` );
          liveStats.push( fileUrl );
          setUploadStates( liveStats );
          if ( idx === uploadFiles.length -1 ) setUploadStatus( 'completed!' );
          // You can add additional logic here if needed, e.g., update UI or store image URLs
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus( 'error' );
      }
    }
  }

};

const handleUploadFileBatch = async (): Promise<void> => {
  await saveFilesToLibrary( files, props.FilesSource, true );
};
const handleUploadFiles = async (): Promise<void> => {
  await saveFilesToLibrary( files, props.FilesSource, false );
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

console.log( `UploadStatus:  ParentFileSample ~ 94` );
  return (
    <div>
      <h2>File Upload Demo</h2>
      { files && files.length > 0 && uploadStatus && uploadStatus.indexOf( 'Success' ) === 0 ?
      <button
        onClick={ handleUploadFiles }
      >
        Save to SharePoint
      </button> : undefined }
      { files && files.length > 0 && uploadStatus && uploadStatus.indexOf( 'Success' ) === 0 ?
      <button
        onClick={ handleUploadFileBatch }
      >
        Batch Save to SharePoint
      </button> : undefined }

      { uploadStates && uploadStates.length > 0 ? <div>
        <h3>Upload States</h3>
        {uploadStates.length > 0 ? (
          <ol>
            {uploadStates.map((upload, index) => (
              <li key={index}>{upload.status} {upload.statusText} {upload.unifiedPerformanceOps.save.startStr } @ {upload.unifiedPerformanceOps.save.ms }: { files[ index ].name } - { getSizeLabel( files[ index ].size ) } </li>
            ))}
          </ol>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div> : undefined }

      <FileDropContainer
        useDropBox={ true }
        fileTypes={ props.fileDropBoxProps.fileTypes }  // Accept only PNG and JPEG files
        setParentFilesData={handleFileUpdate}  // Callback to receive file updates
        maxUploadCount={props.fileDropBoxProps.maxUploadCount}
        fileMaxSize={ props.fileDropBoxProps.fileMaxSize }
        fileWarnSize={ props.fileDropBoxProps.fileWarnSize }
        refreshId={ props.fileDropBoxProps.refreshId }
        resetId={ props.fileDropBoxProps.resetId }
      />
      <div>

        <h3>PARENT File Memory: ( { files.length } @ { getSizeLabel( totalSize )} )</h3>
        { createFileElementList( files, props.fileDropBoxProps.fileWarnSize, undefined, false, true ) }
      </div>
    </div>
  );
};

export default ParentComponent;
