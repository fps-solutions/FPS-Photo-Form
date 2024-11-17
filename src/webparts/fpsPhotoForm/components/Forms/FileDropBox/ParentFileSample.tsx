
// ParentComponent.tsx

import * as React from 'react';
import { useState } from 'react';
import FileDropContainer from './fps-FileDropContainer';
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { postSourceFilesAPI } from '@mikezimm/fps-core-v7/lib/restAPIs/lists/files/postSourceFilesAPI';
// import { postSourceFilesAPI } from './functions/postSourceFilesAPI';

import { makeid } from '../../../fpsReferences';
import {  getMIMEObjectPropFromType, IMIMEType_Specific, } from './fps-FileDropTypes';
import { getSizeLabel } from '@mikezimm/fps-core-v7/lib/logic/Math/labels';
import { IFpsItemsReturn } from '@mikezimm/fps-core-v7/lib/components/molecules/process-results/CheckItemsResults';
import { IFileDropBoxProps } from './fps-FileDropBox';


export interface IFileDropContainerParent  {
  FilesSource: ISourceProps;
  fileDropBoxProps: IFileDropBoxProps;
}

const ParentComponent: React.FC<IFileDropContainerParent> = ( props ) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus ] = useState( null );
  const [uploadStates, setUploadStates ] = useState<IFpsItemsReturn[]>( [] );


  const totalSize: number = files.reduce((total, file) => total + file.size, 0);

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
        fileTypes={ props.fileDropBoxProps.fileTypes }  // Accept only PNG and JPEG files
        setParentFilesData={handleFileUpdate}  // Callback to receive file updates
        maxUploadCount={props.fileDropBoxProps.maxUploadCount}
        fileMaxSize={ props.fileDropBoxProps.fileMaxSize }
        fileWarnSize={ props.fileDropBoxProps.fileWarnSize }
        refreshId={ props.fileDropBoxProps.refreshId }
      />
      <div>
        <h3>PARENT File Memory: ( { files.length } @ { getSizeLabel( totalSize )} )</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}  - { getMIMEObjectPropFromType( file.type as IMIMEType_Specific, 'name', 'fileType' ) } </li>
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
