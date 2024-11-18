import * as React from 'react';
import FileDropBox from './fps-FileDropBox';  // Import the FileDropBox component
import { IFileDropBoxProps } from './IFileDropBoxProps';  // Import the FileDropBox component
import { getSizeLabel } from "@mikezimm/fps-core-v7/lib/logic/Math/labels";
import { createFileElementList } from './fps-FileDropBoxElements';

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

const FileUploadContainer: React.FC<IFileDropBoxProps> = ({ fileTypes, setParentFilesData, style, fileWarnSize = 10000, maxUploadCount, fileMaxSize, refreshId, resetId, useDropBox }) => {
  const [files, setFiles] = React.useState<File[]>([]);
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
        resetId={ resetId }
      />
      <div>
        <h3>Uploaded Files: ( { files.length } @ { getSizeLabel( totalSize )})</h3>
        { createFileElementList( files, fileWarnSize, { handleClickFile: handleClearFile, iconChar: '🗑️' }, true, true ) }
      </div>
    </div>
  );
};

export default FileUploadContainer;
