import * as React from 'react';
import FileDropBox, { IFileDropBoxProps } from './fps-FileDropBox';  // Import the FileDropBox component
import { getMIMEObjectPropFromType, IMIMEType_Specific, } from './fps-FileDropTypes';
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";

// export interface IFileDropContainerProps {
//   maxCount?: number; // Default 10
//   KBmax?: number; // Max file size in kb
//   KBwarn?: number; // Warn file size in kb
//   fileTypes?: IMIMETypesObject[];  // Only accepts the specified valid MIME typesOptional prop to restrict accepted file types (e.g., 'image/png, image/jpeg')
//   setParentFilesData: (files: File[]) => void;  // Callback to send the updated list of files to the parent component
//   style?: React.CSSProperties;  // Optional custom styles for the container
// }

const FileUploadContainer: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, KBwarn = 10000, }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const totalSize: number = files.reduce((total, file) => total + file.size, 0);

  // Callback to handle the file data received from FileDropBox
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
    // setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // onFileUpdate([...files, ...newFiles]);  // Pass the updated list to the parent component
  };
  console.log( `UploadStatus:  FileDropContainer ~ 36` );
  return (
    <div style={style}>
      <h2>Upload Files</h2>
      <FileDropBox
        fileTypes={fileTypes}  // Pass accepted file types to FileDropBox
        setParentFilesData={handleFileUpdate}  // Pass the handler to FileDropBox
      />
      <div>
        <h3>Uploaded Files: ( { files.length } @ { getSizeLabel( totalSize )})</h3>
        <ol>
          {files.map((file, index) => (
            <li key={index}>{file.name} &nbsp;&nbsp;&nbsp; [ { getMIMEObjectPropFromType( file.type as IMIMEType_Specific, 'name', 'fileType' ) }  { file.size > KBwarn * 1000 ? <span style={{ color: 'red', fontWeight: 600 }}>{ getSizeLabel( file.size ) }</span> : '' } ]</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default FileUploadContainer;
