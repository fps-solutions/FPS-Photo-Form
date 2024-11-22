import { IAxisMap } from "../../Scatter/IScatterChartProps";
import { IFileNameHandleBars } from "./IFileDropBoxProps";


/**
 * This builds a mapping cross reference between IScatterPlotItem and IFileNameHandleBars used later for replacing handle bar values
 *    Will help determine which handlebar props to leverage to generate a file name for the uploaded file
 * @param fileNameHandlebar
 * @param axisMap
 * @returns
 */
export function buildPhotoFormFileNameHandleBarsDef( fileNameHandlebar: string, axisMap: IAxisMap ): IFileNameHandleBars {

  const result: IFileNameHandleBars = {
    fileNameHandlebar: fileNameHandlebar, // Handle Bars syntax for naming files
  };

  if ( axisMap.Title ) result.Title = axisMap.Title;
  if ( axisMap.Comments ) result.Title = axisMap.Comments;

  if ( axisMap.Category1 ) result.Category1 = axisMap.Category1;
  if ( axisMap.Category2 ) result.Category2 = axisMap.Category2;
  if ( axisMap.Category3 ) result.Category3 = axisMap.Category3;

  if ( axisMap.horz ) result.Number1 = axisMap.horz;
  if ( axisMap.vert ) result.Number1 = axisMap.vert;
  if ( axisMap.depth ) result.Number1 = axisMap.depth;

  if ( axisMap.Date1 ) result.Date1 = axisMap.Date1;
  if ( axisMap.Time1 ) result.Time1 = axisMap.Time1;
  if ( axisMap.Date2 ) result.Date2 = axisMap.Date2;
  if ( axisMap.Time2 ) result.Time2 = axisMap.Time2;

  return result;

}
