
/**
 * Use these functions/interfaces in conjunction with functions like
 *    buildPhotoFormFileName
 *    buildScatterPlotFileName
 */

import { ITheTime } from "@mikezimm/fps-core-v7/lib/logic/Time/Interfaces";
import { makeTheTimeObject } from "@mikezimm/fps-core-v7/lib/logic/Time/timeObject";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTextFromVarious( val: any, cleanUndefinedNull: boolean = true ): string {
  if ( !val ) return '';
  if ( typeof val === 'string' ) return val;
  if ( typeof val === 'number' ) return `${val}`;
  if ( Array.isArray(val) === true ) {
    // eslint-disable-next-line no-useless-escape
    let result = JSON.stringify( val ).replace(/[\[\]"']/g, '');
    if ( cleanUndefinedNull === true ) result = result.replace(/\b(undefined|null)\b/g, '');
    // This will match and replace any occurrence of one or more commas with or without extra spaces, condensing them into a single comma.
    result = result.replace(/,\s*,+/g, ',');
    return result;
  }
}

export function processCommonFileNameHandleBars(fileNameHandleBarStr: string, originalNameNoExt: string, maxLength: number, fileExtension: string): string {

  const theTime: ITheTime = makeTheTimeObject(null);

  fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Original}}`, originalNameNoExt ? originalNameNoExt : '');
  fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Today}}`, theTime.dayYYYYMMDD);
  fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Now}}`, `${theTime.dayYYYYMMDD}_${theTime.hour}-${theTime.minute}`);

  // remove special characters from the filename:  https://github.com/fps-solutions/FPS-Photo-Form/issues/9, https://github.com/fps-solutions/FPS-Photo-Form/issues/81
  // eslint-disable-next-line no-useless-escape
  fileNameHandleBarStr = fileNameHandleBarStr.replace(/[\\/:*?\'"<>|#&]/g, '');

  if (fileNameHandleBarStr.length > maxLength) fileNameHandleBarStr = `${fileNameHandleBarStr.substring(0, maxLength)}...and more_`;

  if (fileExtension) fileNameHandleBarStr += `.${fileExtension}`;

  return fileNameHandleBarStr;
}

