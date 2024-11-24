import { ITheTime } from "@mikezimm/fps-core-v7/lib/logic/Time/Interfaces";
import { makeTheTimeObject } from "@mikezimm/fps-core-v7/lib/logic/Time/timeObject";
import { IScatterPlotItem } from "../../Scatter/IScatterChartProps";
import { IFileNameHandleBars, getTextFromVarious, processCommonFileNameHandleBars } from "./filenameGenerator";


export function buildScatterPlotFileName(item: IScatterPlotItem, originalName: string, mapping: IFileNameHandleBars, maxLength: number = 190): string {

  const { Title, Comments, Category1, Category2, Category3, Number1, Number2, Number3, Date1, Time1, Date2, Time2 } = mapping;

  let fileNameHandleBarStr: string = `${mapping.fileNameHandleBars}`;

  const fileExtension = originalName.split('.').pop() || '';
  const originalNameNoExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;

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
  if (Title) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Title}}`, getTextFromVarious(item.Title));
  if (Comments) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Comments}}`, getTextFromVarious(item.Comments));

  if (Category1) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Category1}}`, getTextFromVarious(item.Category1));
  if (Category2) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Category2}}`, getTextFromVarious(item.Category2));
  if (Category3) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Category3}}`, getTextFromVarious(item.Category3));

  if (Number1) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Number1}}`, getTextFromVarious(item[Number1 as 'Title']));
  if (Number2) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Number2}}`, getTextFromVarious(item[Number2 as 'Title']));
  if (Number3) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Number3}}`, getTextFromVarious(item[Number3 as 'Title']));

  if (Date1) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Date1}}`, makeTheTimeObject(item[Date1 as unknown as 'Title']).dayYYYYMMDD);
  if (Date2) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Date2}}`, makeTheTimeObject(item[Date2 as unknown as 'Title']).dayYYYYMMDD);

  const t1 = makeTheTimeObject(item[Time1 as unknown as 'Title']);
  if (Time1) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Time1}}`, `${t1.hour}-${t1.minute}`);

  const t2 = makeTheTimeObject(item[Time2 as unknown as 'Title']);
  if (Time2) fileNameHandleBarStr = fileNameHandleBarStr.replace(`{{Time2}}`, `${t2.hour}-${t2.minute}`);

  fileNameHandleBarStr = processCommonFileNameHandleBars(fileNameHandleBarStr, originalNameNoExt, maxLength, fileExtension);

  return fileNameHandleBarStr;
}
