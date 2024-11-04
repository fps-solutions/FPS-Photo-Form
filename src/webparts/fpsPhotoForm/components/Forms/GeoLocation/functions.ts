/**
 * 2024-10-31 GeoLocation code originally migrated from PhotoForm Webpart sample
 *    Happy Halloween 2024!
 */

import { IFpsGeolocationCoordinates, IFpsGeolocationPosition } from "./interfaces";

export const UnknownGeoLocation: IFpsGeolocationPosition = {
  timestamp: new Date().getTime(),
  localTime: new Date().toLocaleString(),
  coords: {} as IFpsGeolocationCoordinates,
  status: 'Unknown',
  message: '',
  error: null,
};

export function getGeoLocation( debugMode: boolean ): Promise<IFpsGeolocationPosition> {
  return new Promise((resolve, reject) => {
    if ( debugMode ) alert(`debugMode getGeoLocation ~ 19`);
    let result: IFpsGeolocationPosition = JSON.parse(JSON.stringify(UnknownGeoLocation));
    if ( debugMode ) alert(`debugMode getGeoLocation ~ 21`);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if ( debugMode ) alert(`debugMode getGeoLocation ~ 25`);
          result = JSON.parse(JSON.stringify(position));
          if ( debugMode ) alert(`debugMode getGeoLocation ~ 27`);
          result.status = 'Success';

          result.localTime = new Date( result.timestamp ).toLocaleString();
          // https://github.com/fps-solutions/FPS-Photo-Form/issues/68
          if ( result.localTime.indexOf('Invalid') > -1 ) {
            result.status = 'Error';
            result.error = { code: 2, message: 'Invalid Time'};
          }

          result.message = `${result.localTime}`;
          if ( debugMode ) alert(`debugMode getGeoLocation ~ 31: ${JSON.stringify( result )}`);
          resolve(result); // Resolve the promise with the result
        },
        (error) => {
          if ( debugMode ) alert(`debugMode getGeoLocation ~ 35`);
          console.error('Error obtaining location:', error);
          if ( debugMode ) alert(`debugMode getGeoLocation ~ 37: ${error.message}`);
          result.status = 'Error';
          result.error = error;
          result.message = error.message;
          reject(result); // Reject the promise with the error result
        },
        { enableHighAccuracy: true } // Add this line
      );
    } else {
      result.status = 'Error';
      result.message = 'Geolocation is not supported by this browser.';
      if ( debugMode ) alert(`debugMode getGeoLocation ~ 48: ${result.message}`);
      reject(result); // Reject the promise
    }
  });
}
