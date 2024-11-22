
import { makeTheTimeObject } from "@mikezimm/fps-core-v7/lib/logic/Time/timeObject";
import { ITheTime } from "@mikezimm/fps-core-v7/lib/logic/Time/Interfaces";
import { IScatterPlotItem, } from "../../Scatter/IScatterChartProps";
import { IPhotoFormForm, IPhotoFormFormInterface } from "../PasteFormForm";

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
function getTextFromVarious( val: any, cleanUndefinedNull: boolean = true ): string {
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


export function buildPhotoFormFileName( formData: IPhotoFormFormInterface, formProps: IPhotoFormForm, originalName: string, mapping: IFileNameHandleBars, maxLength: number = 190 ): string {

  const { Title, Comments, Category1, Category2, Category3, Number1, Number2, Number3, } = mapping;

  let fileNameHandleBarStr: string = `${mapping.fileNameHandleBars}`;

  const fileExtension =originalName.split('.').pop() || '';
  const fileNameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  /**
   * Basic logic:
   *  1. Check for all handleBarReplacement values found in string
   *  2. Loop through each one
   *  3. Check if each one is valid
   *  4. If valid, replace all instances with the:
   *      mapped value, if there is one, else ''
   *  5. Replace {{Original}}
   *  6. Replace {{Today}}
   *  7. Replace {{Now}}
   */

  if ( Title ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Title}}`, getTextFromVarious(formData.title) );
  if ( Comments ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Comments}}`, getTextFromVarious(formData.comments) );

  if ( Category1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Category1}}`, getTextFromVarious(formProps.Category1s[ formData.category1 ] ) );
  if ( Category2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Category2}}`, getTextFromVarious(formData.category2.map( ( idx: number ) => { return formProps.Category2s[ idx ] } )) );
  if ( Category3 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Category3}}`, getTextFromVarious(formData.category3.map( ( idx: number ) => { return formProps.Category3s[ idx ] } )) );

  if ( Number1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Number1}}`, getTextFromVarious(formData.x) );
  if ( Number2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Number2}}`, getTextFromVarious(formData.y) );
  if ( Number3 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Number3}}`, getTextFromVarious(formData.z) );

  // if ( Date1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Date1}}`, makeTheTimeObject(item[ Date1 as unknown as 'Title' ]).dayYYYYMMDD );
  // if ( Date2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Date2}}`, makeTheTimeObject(item[ Date2 as unknown as 'Title' ]).dayYYYYMMDD );

  // const t1 = makeTheTimeObject(item[ Time1 as unknown as 'Title' ]);
  // if ( Time1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Time1}}`, `${t1.hour}-${t1.minute}` );

  // const t2 = makeTheTimeObject(item[ Time2 as unknown as 'Title' ]);
  // if ( Time2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Time2}}`, `${t2.hour}-${t2.minute}` );

  const theTime: ITheTime = makeTheTimeObject( null );

  fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Original}}`, fileNameWithoutExtension ? fileNameWithoutExtension : '' );
  fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Today}}`, theTime.dayYYYYMMDD );
  fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Now}}`, `${theTime.dayYYYYMMDD}_${theTime.hour}-${theTime.minute}` );


  // remove special characters from the filename:  https://github.com/fps-solutions/FPS-Photo-Form/issues/9, https://github.com/fps-solutions/FPS-Photo-Form/issues/81
  // eslint-disable-next-line no-useless-escape
  fileNameHandleBarStr = fileNameHandleBarStr.replace(/[\\/:*?\'"<>|#&]/g, '' );

  if ( fileNameHandleBarStr.length > maxLength ) fileNameHandleBarStr = `${fileNameHandleBarStr.substring(0, maxLength)}...and more_`;

  if ( fileExtension ) fileNameHandleBarStr += `.${fileExtension}`;


  return fileNameHandleBarStr;
}

export function buildScatterPlotFileName( item: IScatterPlotItem, originalName: string, mapping: IFileNameHandleBars ): string {

  const { Title, Comments, Category1, Category2, Category3, Number1, Number2, Number3, Date1, Time1, Date2, Time2 } = mapping;

  let fileNameHandleBarStr: string = `${mapping.fileNameHandleBars}`;

  /**
   * Basic logic:
   *  1. Check for all handleBarReplacement values found in string
   *  2. Loop through each one
   *  3. Check if each one is valid
   *  4. If valid, replace all instances with the:
   *      mapped value, if there is one, else ''
   *  5. Replace {{Original}}
   *  6. Replace {{Today}}
   *  7. Replace {{Now}}
   */

  if ( Title ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Title}}`, getTextFromVarious(item.Title) );
  if ( Comments ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Comments}}`, getTextFromVarious(item.Comments) );

  if ( Category1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Category1}}`, getTextFromVarious(item.Category1) );
  if ( Category2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Category2}}`, getTextFromVarious(item.Category2) );
  if ( Category3 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Category3}}`, getTextFromVarious(item.Category3) );

  if ( Number1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Number1}}`, getTextFromVarious(item[ Number1 as 'Title']) );
  if ( Number2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Number2}}`, getTextFromVarious(item[ Number2 as 'Title']) );
  if ( Number3 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Number3}}`, getTextFromVarious(item[ Number3 as 'Title']) );

  if ( Date1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Date1}}`, makeTheTimeObject(item[ Date1 as unknown as 'Title' ]).dayYYYYMMDD );
  if ( Date2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Date2}}`, makeTheTimeObject(item[ Date2 as unknown as 'Title' ]).dayYYYYMMDD );

  const t1 = makeTheTimeObject(item[ Time1 as unknown as 'Title' ]);
  if ( Time1 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Time1}}`, `${t1.hour}-${t1.minute}` );

  const t2 = makeTheTimeObject(item[ Time2 as unknown as 'Title' ]);
  if ( Time2 ) fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Time2}}`, `${t2.hour}-${t2.minute}` );

  const theTime: ITheTime = makeTheTimeObject( null );

  fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Original}}`, originalName ? originalName : '' );
  fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Today}}`, theTime.dayYYYYMMDD );
  fileNameHandleBarStr = fileNameHandleBarStr.replace( `{{Now}}`, `${theTime.dayYYYYMMDD}_${theTime.hour}-${theTime.minute}` );

  return fileNameHandleBarStr;
}