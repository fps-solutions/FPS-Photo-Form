import { makeid } from "../../../fpsReferences";
import { convertFileSizeStringToNum } from "./convertFileSizeStringToNum";
import { getMIMEObjectsFromSelectedTypes, IMIMETypesObject, Specific_MIME_Objects } from "./fps-FileDropTypes";

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

export interface IFileDropBoxWPProps {
  defaultPasteMode?: boolean;
  maxUploadCount?: string; // Default 10
  fileMaxSize?: string; // Max file size in kb
  fileWarnSize?: string; // Warn file size in kb
  fileTypes?: string[];  // Accepted MIME types (optional)
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
