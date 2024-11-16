import * as React from 'react';
import FileDropBox, { IFileDropBoxProps } from './fps-FileDropBox';  // Import the FileDropBox component
import { getMIMEObjectPropFromType, IMIMEType_Specific, } from './fps-FileDropTypes';
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";

const FileUploadContainer: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, KBwarn = 10000, maxUploadCount, KBmax }) => {
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
        fileTypes={fileTypes}  // Pass accepted file types to FileDropBox
        setParentFilesData={handleFileUpdate}  // Pass the handler to FileDropBox
        maxUploadCount={ maxUploadCount }
        KBmax={ KBmax }
        KBwarn={ KBwarn }
      />
      <div>
        <h3>Uploaded Files: ( { files.length } @ { getSizeLabel( totalSize )})</h3>
        <ol>
          {files.map((file, index) => (
            <li key={index}>
              <button
                onClick={ ( ) => { handleClearFile( file, index ) } }
                disabled={ false }
                style={{
                  // position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  borderRadius: '20%',
                  width: '1.5em',
                  height: '1.5em',
                  fontSize: '14px',
                  color: '#333',
                  cursor: 'pointer',
                  margin: '.25em',
                  zIndex: 10,
                  padding: '0px', // Added this when using trash icon
                }}
                title={ `CLEAR ${ file.name }` }
              >🗑️</button>
              {file.name} &nbsp;&nbsp;&nbsp; [ { getMIMEObjectPropFromType( file.type as IMIMEType_Specific, 'name', 'fileType' ) }  { file.size > KBwarn * 1000 ? <span style={{ color: 'red', fontWeight: 600 }}>{ getSizeLabel( file.size ) }</span> : '' } ]</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default FileUploadContainer;
