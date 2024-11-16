
// ParentComponent.tsx

import * as React from 'react';
import { useState } from 'react';
import FileDropContainer from './fps-FileDropContainer';
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { IPhotoButtonStyle } from '../IScatterChartProps';
// import { uploadImageToLibrary } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/ClipboardImage/ImageSave';
import { postSourceFilesAPI } from '@mikezimm/fps-core-v7/lib/restAPIs/lists/files/postSourceFilesAPI';
// import { postSourceFilesAPI } from './functions/postSourceFilesAPI';

import { makeid } from '../../../fpsReferences';
import { Common_MIME_Objects, getMIMEObjectPropFromType, IMIMEType_Specific, Specific_MIME_Objects, Specific_MIME_TYPES } from './fps-FileDropTypes';

// Import the uploadImageToLibrary function
// import { uploadImageToLibrary } from './path_to_upload_function'; // Adjust the import path as needed


export interface IFileDropContainerParent  {

  // Category1s: string[];
  // Category2s: string[];
  // Category3s: string[];

  // ListSource: ISourceProps;
  FilesSource: ISourceProps;
  // photoButtonStyles: IPhotoButtonStyle[];

}

const ParentComponent: React.FC<IFileDropContainerParent> = ( props ) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus ] = useState( null );

  const handleFileUpdate = (updatedFiles: File[]): void => {
    const doReset = updatedFiles === null ? true : false;
    setFiles( doReset ? [] : updatedFiles );
    setUploadStatus( updatedFiles && updatedFiles.length > 0 ? `Success: ${makeid(5)}` : null );
  };


// Define the setParentFilesData function
const saveFilesToLibrary = async (uploadFiles: File[], FileSource: ISourceProps): Promise<void> => {
  // Iterate over each file and upload it to SharePoint
  for (const file of uploadFiles) {
    try {
      // Call the uploadImageToLibrary function using each file as a Blob
      const fileUrl = await postSourceFilesAPI(FileSource, true, file, file.name, true, true );

      if (fileUrl) {
        console.log(`File uploaded successfully: ${fileUrl}`);
        setUploadStatus( `Success: ${makeid(5)}` );
        // You can add additional logic here if needed, e.g., update UI or store image URLs
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus( 'error' );
    }
  }
};

const handleUploadFiles = async (): Promise<void> => {
  await saveFilesToLibrary( files, props.FilesSource );
};

  return (
    <div>
      <h2>File Upload Demo</h2>
      { files && files.length > 0 && uploadStatus && uploadStatus.indexOf( 'Success' ) === 0 ?
      <button
        onClick={ handleUploadFiles }
      >
        Save to SharePoint
      </button> : undefined }
      <FileDropContainer
        fileTypes={ Common_MIME_Objects }  // Accept only PNG and JPEG files
        setParentFilesData={handleFileUpdate}  // Callback to receive file updates
      />
      <div>
        <h3>PARENT File Memory: ( { files.length } )</h3>
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
