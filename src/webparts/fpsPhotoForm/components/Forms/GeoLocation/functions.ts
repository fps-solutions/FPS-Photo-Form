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

export function getGeoLocation(): Promise<IFpsGeolocationPosition> {
  return new Promise((resolve, reject) => {
    let result: IFpsGeolocationPosition = JSON.parse(JSON.stringify(UnknownGeoLocation));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          result = JSON.parse(JSON.stringify(position));
          result.status = 'Success';
          result.localTime = new Date( result.timestamp ).toLocaleString();
          result.message = `@${result.localTime}`;
          resolve(result); // Resolve the promise with the result
        },
        (error) => {
          console.error('Error obtaining location:', error);
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
      reject(result); // Reject the promise
    }
  });
}
