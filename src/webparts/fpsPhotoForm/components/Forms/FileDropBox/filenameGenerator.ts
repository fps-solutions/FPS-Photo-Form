
import { getHandleBarPropsFromString } from "@mikezimm/fps-core-v7/lib/logic/Strings/handleBarsHTML";
import { makeTheTimeObject } from "@mikezimm/fps-core-v7/lib/logic/Time/timeObject";
import { ITheTime } from "@mikezimm/fps-core-v7/lib/logic/Time/Interfaces";
import { IScatterPlotItem } from "../../Scatter/IScatterChartProps";

export interface IFileNameHandleBars {

  fileNameHandlebar: string; // Handle Bars syntax for naming files
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

export function buildPhotoFormFileName( item: IScatterPlotItem, originalName: string, mapping: IFileNameHandleBars ): string {


  const { Title, Comments, Category1, Category2, Category3, Number1, Number2, Number3, Date1, Time1, Date2, Time2 } = mapping;

  let fileNameHandlebar: string = mapping.fileNameHandlebar;

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

  if ( Title ) fileNameHandlebar = fileNameHandlebar.replace( `{{Title}}`, item.Title ? item.Title : '' );
  if ( Comments ) fileNameHandlebar = fileNameHandlebar.replace( `{{Comments}}`, item.Comments ? item.Comments : '' );
  if ( Category1 ) fileNameHandlebar = fileNameHandlebar.replace( `{{Category1}}`, item.Category1 ? item.Category1 : '' );
  if ( Category2 ) fileNameHandlebar = fileNameHandlebar.replace( `{{Category2}}`, item.Category2 ? item.Category2.join(', ') : '' );
  if ( Category3 ) fileNameHandlebar = fileNameHandlebar.replace( `{{Category3}}`, item.Category3 ? item.Category3.join(', ') : '' );


  const theTime: ITheTime = makeTheTimeObject( null );

  fileNameHandlebar = fileNameHandlebar.replace( `{{Original}}`, originalName ? originalName : '' );
  fileNameHandlebar = fileNameHandlebar.replace( `{{Today}}`, theTime.dayYYYYMMDD );
  fileNameHandlebar = fileNameHandlebar.replace( `{{Now}}`, `${theTime.dayYYYYMMDD}_${theTime.hour}-${theTime.minute}` );

  return fileNameHandlebar;
}