import * as React from 'react';
import FileDropBox, { IFileDropBoxProps } from './fps-FileDropBox';  // Import the FileDropBox component
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";
import { createFileElementList } from './fps-FileDropBoxElements';

const FileUploadContainer: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, fileWarnSize = 10000, maxUploadCount, fileMaxSize, refreshId, useDropBox }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const totalSize: number = files.reduce((total, file) => total + file.size, 0);

  // Callback to handle the file data received from FileDropBox
  //  - NOTE this only handles ADDING files and bumps dup files to the top of the list
  const handleFileUpdate = (newFiles: File[]): void => {
    const doReset = newFiles === null ? true : false;
    if ( doReset === true ) {
      setFiles( [] );
      setParentFilesData( null );  // Pass the updated list to the parent component
    } else {
      const keepFiles: File[] = newFiles;
      const keepNames: string[] = keepFiles.map( file => { return file.name } );
      // Add pre-existing files into keepFiles only if the name doesn't already exist.
      files.map( file => { if ( keepNames.indexOf( file.name ) < 0 ) { keepFiles.push( file ); keepNames.push( file.name ); } } );
      setFiles( keepFiles );
      setParentFilesData( keepFiles );  // Pass the updated list to the parent component
    }
  };

  /**
   *  handleClearFile removes a specific file from the files array.
   *    https://github.com/fps-solutions/FPS-Photo-Form/issues/93
   *  Can NOT use handleFileUpdate because it is designed with different logic to add newFiles
   */
  const handleClearFile = (file: File, index: number ): void => {
    const keepFiles = files.filter((_, i) => i !== index);
    console.log( `handleClearFile keepFiles:`, keepFiles.length, keepFiles );
    setFiles( keepFiles );
    setParentFilesData( keepFiles );  // Pass the updated list to the parent component
  }

  console.log( `UploadStatus:  FileDropContainer ~ 36` );

  return (
    <div style={style}>
      <h2>Upload Files</h2>
      <FileDropBox
        useDropBox={useDropBox}
        fileTypes={fileTypes}  // Pass accepted file types to FileDropBox
        setParentFilesData={handleFileUpdate}  // Pass the handler to FileDropBox
        maxUploadCount={ maxUploadCount }
        fileMaxSize={ fileMaxSize }
        fileWarnSize={ fileWarnSize }
        refreshId={ refreshId }
      />
      <div>
        <h3>Uploaded Files: ( { files.length } @ { getSizeLabel( totalSize )})</h3>
        { createFileElementList( files, fileWarnSize, { handleClickFile: handleClearFile, iconChar: '🗑️' }, true, true ) }
      </div>
    </div>
  );
};

export default FileUploadContainer;
