import { makeid } from "../../../fpsReferences";
import { IAxisMap } from "../../Scatter/IScatterChartProps";
import { buildPhotoFormFileNameHandleBarsDef } from "./buildPhotoFormFileNameHandleBarsDef";
import { convertFileSizeStringToNum } from "./convertFileSizeStringToNum";
import { getMIMEObjectsFromSelectedTypes, IMIMETypesObject, Specific_MIME_Objects } from "./fps-FileDropTypes";

/**
 * Use this with function similar to buildPhotoFormFileNameHandleBarsDef to create the expected result
 *
 */
export interface IFileNameHandleBars {

  fileNameHandleBars: string; // Handle Bars syntax for naming files
  // Original: string;
  // Today: string;
  // Now: string;
  Title?: string;
  Comments?: string;
  Category1?: string;
  Category2?: string;
  Category3?: string;

  Number1?: string;
  Number2?: string;
  Number3?: string;

  Date1?: string;
  Time1?: string;

  Date2?: string;
  Time2?: string;

}

export interface IFileDropBoxProps {
  useDropBox?: boolean;
  maxUploadCount?: number; // Default 10
  fileMaxSize?: number; // Max file size in kb
  fileWarnSize?: number; // Warn file size in kb
  fileTypes?: IMIMETypesObject[];  // Accepted MIME types (optional)
  // fileTypes?: IMIMEType_Valid[];  // Accepted MIME types (optional)
  fileNameHandleBars: IFileNameHandleBars;
  setParentFilesData: (files: File[]) => void;  // Callback to update parent with files
  style?: React.CSSProperties;  // Optional: Custom styling for the component
  refreshId?: string;
  resetId: string; // If this changes, it will clear the upload cache
}

// NOTE: changesFileDropBox must match the keys of IFileDropBoxWPProps
export const changesFileDropBox: (keyof IFileDropBoxWPProps)[] = [ 'defaultPasteMode', 'maxUploadCount', 'fileMaxSize', 'fileWarnSize', 'fileTypes', 'fileNameHandleBars' ]

export interface IFileDropBoxWPProps {
  defaultPasteMode?: boolean;
  maxUploadCount: string; // Default 10
  fileMaxSize?: string; // Max file size in kb
  fileWarnSize?: string; // Warn file size in kb
  fileTypes?: string[];  // Accepted MIME types (optional)
  fileNameHandleBars: string; // Handle Bars syntax for naming files
}

export function convertFileDropWPPropsToFileDropBoxProps( properties: IFileDropBoxWPProps, AxisMap: IAxisMap ): IFileDropBoxProps {

  const { maxUploadCount, fileMaxSize, fileWarnSize, fileTypes, defaultPasteMode, fileNameHandleBars } = properties;

  const HandleBarsNameGen: IFileNameHandleBars = buildPhotoFormFileNameHandleBarsDef( fileNameHandleBars, AxisMap );

  const result: IFileDropBoxProps = {
    setParentFilesData: null,
    fileTypes: [],
    refreshId: makeid(5),
    resetId: makeid(5),
    useDropBox: true,
    fileNameHandleBars: HandleBarsNameGen,
  };

  if ( maxUploadCount ) result.maxUploadCount = parseInt( maxUploadCount );
  if ( fileMaxSize ) result.fileMaxSize = convertFileSizeStringToNum( fileMaxSize );
  if ( fileWarnSize ) result.fileWarnSize = convertFileSizeStringToNum( fileWarnSize );
  if ( defaultPasteMode === true ) result.useDropBox = false;
  if ( fileTypes && fileTypes.length > 0 ) {
    result.fileTypes = getMIMEObjectsFromSelectedTypes( Specific_MIME_Objects, properties.fileTypes );
  }
  return result;
}
