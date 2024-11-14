
// import { ISourceProps, } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps'; ///ISourceProps';
// import { checkItemsResults, IFpsItemsReturn } from '@mikezimm/fps-core-v7/lib/components/molecules/process-results/CheckItemsResults';
// import { startPerformOpV2, updatePerformanceEndV2 } from "@mikezimm/fps-core-v7/lib/components/molecules/Performance/functions";
// import { check4This } from "@mikezimm/fps-core-v7/lib/logic/Links/CheckSearch";
// import { IPerformanceOp } from "@mikezimm/fps-core-v7/lib/components/molecules/Performance/IPerformance";
// import { createErrorFpsListReturn } from '@mikezimm/fps-core-v7/lib/components/molecules/process-results/createErrorFpsListItemsReturn';
// import { doSpJsFileFetchOrPost } from './doSpJsFileFetch';
// import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl';

// export const SourcePropsNoWebUrl: string = `SourceProps does NOT have an absoluteWebUrl`;
// export const SourcePropsNoListTitle: string = `SourceProps does NOT have an listTitle`;

// // import { ISourceProps, SourcePropsNoListTitle, SourcePropsNoWebUrl } from '../../../components/molecules/source-props/ISourceProps'; ///ISourceProps';
// // import { checkItemsResults, IFpsItemsReturn } from '../../../components/molecules/process-results/CheckItemsResults';
// // import { startPerformOpV2, updatePerformanceEndV2 } from "../../../components/molecules/Performance/functions";
// // import { check4This } from "../../../logic/Links/CheckSearch";
// // import { IPerformanceOp } from "../../../components/molecules/Performance/IPerformance";
// // import { createErrorFpsListReturn } from '../../../components/molecules/process-results/createErrorFpsListItemsReturn';
// // import { doSpJsFileFetchOrPost } from '../../../components/molecules/SpHttp/doSpJsFileFetch';

// /**
//  * NOTE:  You need a CURRENT digest value in source props or it will fetch one... if this is a batch op, be sure to fetch and include once for performance
//  * @param sourceProps
//  * @param overWrite
//  * @param blob
//  * @param fileName
//  * @param alertMe
//  * @param consoleLog
//  * @returns
//  */
// export async function postSourceFilesAPI( sourceProps: ISourceProps, overWrite: boolean, blob:  Blob, fileName: string, alertMe: boolean | undefined, consoleLog: boolean | undefined, ): Promise<IFpsItemsReturn>  {

//   const { performanceSettings } = sourceProps;
//   const fetchOp = performanceSettings ? startPerformOpV2( performanceSettings ) : null;

//   const { absoluteWebUrl, listTitle, subFolder } = sourceProps;

//   /**
//     Make a POST request to the SharePoint REST API to upload the file
//   */
//   const folderRelativeUrl = subFolder ? `${listTitle}/${subFolder}` : listTitle;

//   const postAPI: string = `${absoluteWebUrl}/_api/web/GetFolderByServerRelativeUrl('${folderRelativeUrl}')/Files/add(url='${fileName}', overwrite=${overWrite})`;

//   if ( !absoluteWebUrl ) {
//     // NO WebURL... Throw Alert
//     if ( alertMe === true ) alert(`${listTitle} ${SourcePropsNoWebUrl}`);
//     return createErrorFpsListReturn( absoluteWebUrl, listTitle );
//   }

//   if ( !listTitle ) {
//     // NO WebURL... Throw Alert
//     if ( alertMe === true ) alert(`${''} ${SourcePropsNoListTitle}`);
//     return createErrorFpsListReturn( absoluteWebUrl, listTitle );
//   }

//   const requestDigest = sourceProps.digestValue ? sourceProps.digestValue : await getThisFPSDigestValueFromUrl(sourceProps.absoluteWebUrl as '');
//   const initialResult = await doSpJsFileFetchOrPost( postAPI, 'POST', requestDigest, '', blob );

//   const result : IFpsItemsReturn = checkItemsResults( initialResult, `fps-core-v7: postSourceItems ~ 46`, alertMe, consoleLog );
//   result.fpsContentType = !sourceProps.fpsContentType ? [ 'file', 'item' ] : sourceProps.fpsContentType;
//   if ( sourceProps.fpsContentType.indexOf( 'item' ) < 0 ) result.fpsContentType.push( 'item' );
//   if ( sourceProps.fpsContentType.indexOf( 'file' ) < 0 ) result.fpsContentType.push( 'file' );

//   result.unifiedPerformanceOps.save = performanceSettings ?
//     updatePerformanceEndV2( { op: fetchOp as IPerformanceOp, updateMiliseconds: performanceSettings.updateMiliseconds, count: 1 })
//     : null as any;  // 2024-09-29:  set null as any to pass build error.

//   result.fetchOp = result.unifiedPerformanceOps.save;

//   if ( check4This( `fpsShowFetchResults=true` ) === true ) { console.log( `fps-core-v7 COMPLETE: postSourceItems ~ 56`, result ) }

//   return result;

// }