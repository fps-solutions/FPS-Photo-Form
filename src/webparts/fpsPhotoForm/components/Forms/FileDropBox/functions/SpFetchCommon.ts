import { check4This } from "@mikezimm/fps-core-v7/lib/logic/Links/CheckSearch";
import { checkDeepProperty } from "@mikezimm/fps-core-v7/lib/logic/Objects/deep";
import { IJSFetchReturn } from "./IJSFetchReturn";

export async function addCatchResponseError( results: IJSFetchReturn, response: Response, digestValue: string ): Promise<IJSFetchReturn> {

  results.ok = response.ok;
  results.statusText = response.statusText;
  results.statusNo = response.status;
  results.status = 'Error';

  /**
   * 2024-10-02: Added this to help provide detailed feedback on error
   *  https://github.com/fps-solutions/fps-core-v7/issues/6
   */
  const errorDetails = await response.json();
  const errMessage = checkDeepProperty( errorDetails, [ 'error', 'message', ], 'FullError', true ); //errorDetails['odata.error'] && errorDetails['odata.error'].message ? errorDetails['odata.error'].message : 'unknown doSpJsFileFetchOrPost error ~ 93';
  // 2024-10-02: Had to force to this format for a known error struture ( when column is missing ) to get it to work in friendly.ms
  results.e = { message: errMessage.value, lang: errMessage.lang, };

  if ( check4This( 'fpsShowFetchResults=true' ) === true ) console.log( `fps-core-v7 Api Error: addCatchResponseError ~ 27 results`, results );

  if ( results.e.message.indexOf( 'security validation' ) > -1 ) {
    if ( results.errorInfo ) results.errorInfo.friendly = 'Potential missing or invalid digestValue';
    console.log( 'Invalid security/digestValue: ', digestValue );
    results.statusText = 'Invalid security validation... digestValue?';
    results.status = 'Error';
  }

  return results;

}

export function addUnknownFetchError( results: IJSFetchReturn, e: any): IJSFetchReturn {

  results.ok = false;

  if ( !results.statusNo ) results.statusNo = 667;

  /**
   * Maybe improve this for when list title is incorrect.  Seems to give double error
   */
  const mess = results.statusNo === 404 ? 'Page not found.  Check your site Url'
  : results.statusNo === 403 ? 'You may not have Permissions'
  : e.message ? e.message : 'Unknown Error';  // Added per Co-Pilot for better error handling

  if ( !results.e ) results.e = { message: mess, lang: 'Unknown', };

  if ( !results.statusText ) results.statusText = results.statusNo === 403 ? 'InvalidSecurity - security validation... digestValue?' : `Error TryCatch`;
  if ( results.statusNo === 403 && ( !results.status || results.status === 'Error' ) ) results.status = 'InvalidSecurity';

  if ( check4This( 'fpsShowFetchResults=true' ) === true ) console.log( `fps-core-v7 Logic Error: setUnknownFetchErrorResult ~ 58 fetchAPI`, results.fetchAPI );

  return results;

}