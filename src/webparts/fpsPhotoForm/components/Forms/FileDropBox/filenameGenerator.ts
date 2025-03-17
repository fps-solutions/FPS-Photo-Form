
/**
 * Use these functions/interfaces in conjunction with functions like
 *    buildPhotoFormFileName
 *    buildScatterPlotFileName
 */

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
