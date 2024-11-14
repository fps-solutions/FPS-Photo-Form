
// /**
//  * 2024-09-15:  Migrated to SAME FOLDER in fps-library-v2\src\components\molecules\SpHttp...
//  * export { IJSFetchReturn, createEmptyFetchReturn, doSpJsFetch }
//  */


// import { check4This } from "@mikezimm/fps-core-v7/lib/logic/Links/CheckSearch";
// import { checkDeepProperty } from "@mikezimm/fps-core-v7/lib/logic/Objects/deep";
// import { getFullUrlFromSlashSitesUrl } from "@mikezimm/fps-core-v7/lib/logic/Strings/getFullUrlFromSlashSitesUrl";
// import { getSiteCollectionUrlFromLink } from "@mikezimm/fps-core-v7/lib/logic/Strings/getSiteCollectionUrlFromLink";
// import { check4ThisFPSDigestValue } from "@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/helpers/check4ThisFPSDigestValue";
// import { IJSFetchReturn, createEmptyFetchReturn } from "./IJSFetchReturn";
// import { addCatchResponseError, addUnknownFetchError } from "./SpFetchCommon";

// /**
//  *
//  * @param fetchAPI
//  * @param digestValue - REQUIRES digestValue
//  * @param headerContentType
//  * @param blob
//  * @returns
//  */
// export async function doSpJsFileFetch(fetchAPI: string, digestValue: string, headerContentType: string, blob: Blob ): Promise<IJSFetchReturn> {
//   const results: IJSFetchReturn = await doSpJsFileFetchOrPost( fetchAPI, 'GET', digestValue, headerContentType, blob );
//   return results;
// }

// /**
//  * Pass in any SharePoint rest api url and it should return a result or a standard error return object
//  * @param fetchAPI
//  * @param digestValue - REQUIRES digestValue for POST operations
//  * @returns
//  */
// export async function doSpJsFileFetchOrPost( fetchAPI: string, method: 'GET' | 'POST' = `GET`, digestValue: string, headerContentType: string, blob: Blob, ): Promise<IJSFetchReturn> {

//   // Automatically added this because API's usually need full url.
//   if ( fetchAPI.indexOf( window.location.hostname ) === 0 ) fetchAPI = `https://${fetchAPI}`;

//   // Always make sure this is an absolute url by running through this first.  Note, if the previous line executes, it should be good then.
//   fetchAPI = getFullUrlFromSlashSitesUrl( fetchAPI, false );

//   // Added to just check if digestValue exists and if so, use it here
//   if ( !digestValue ) digestValue = check4ThisFPSDigestValue( getSiteCollectionUrlFromLink( fetchAPI )  );

//   let results: IJSFetchReturn = createEmptyFetchReturn( fetchAPI, method );
//   results.fpsContentType=[ 'file', 'item' ];

//   // Read the Blob as an ArrayBuffer using FileReader with async/await
//   const buffer = !blob ? null : await new Promise<ArrayBuffer>((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.onloadend = () => resolve(fileReader.result as ArrayBuffer);
//     fileReader.onerror = reject;
//     fileReader.readAsArrayBuffer(blob);
//   });

//   const headers: HeadersInit = {
//     Accept: "application/json;odata=verbose",
//     // "Content-Type": headerContentType ? headerContentType : 'application/json;odata=verbose', // NOT in the original uploadImageToLibrary
//   };

//   if ( digestValue ) headers[ 'X-RequestDigest' ] = digestValue;
//   if ( buffer ) headers['Content-Length'] = buffer.byteLength.toString() // Set content length for the upload

//   try {
//     const response = await fetch(fetchAPI, {
//       method: method,
//       headers: headers,
//       body: buffer,
//     });

//     // check if the response is OK
//     if (response.ok) {
//       const data = await response.json();

//       const deepPropValue = checkDeepProperty( data, [ 'd', 'ServerRelativeUrl' ], "Actual" );

//       if ( fetchAPI.indexOf('GetFolderByServerRelativeUrl') > 0 ) {
//         // added logic to solve this:  https://github.com/mikezimm/pivottiles7/issues/292
//         if ( deepPropValue !== undefined && deepPropValue !== null ) {
//           results.itemUrl = deepPropValue;
//           results.ok = true;
//           results.status = 'Success';
//         }
//       } else {
//           results.itemUrl = `Unknown Url`;
//           results.ok = false;
//           results.status = 'Error';
//       }

//       results.statusText = response.statusText;
//       results.statusNo = response.status;
//       if ( check4This( 'fpsShowFetchResults=true' ) === true ) console.log( `fps-core-v7 Success: doSpJsFileFetchOrPost ~ 86 results`, results );

//     } else {
//       results = await addCatchResponseError( results, response, digestValue );

//     }

//     return results;

//   } catch (e) {
//     return addUnknownFetchError( results, e );

//   }

// }
