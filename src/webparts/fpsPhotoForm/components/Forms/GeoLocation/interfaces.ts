// /**
//  * 2024-10-31 GeoLocation code originally migrated from PhotoForm Webpart sample
//  *    Happy Halloween 2024!
//  *    2024-11-04 updated

//   import { IReactCSSProperties } from "../../../../types/react/IReactCSSTypes";

//  * By default:
//  *    enableDetails = true, allowEditing = false, showAltitude = true, heading = 'GPS Location Form'
//  */

// export interface IFpsGpsLocationFormProps {
//   heading?: string; // 'GPS Location Form' by default
//   style?: React.CSSProperties; // Optional inline styles
//   className?: string; // Optional class names
//   buttonClass?: string; // Optional class names
//   onGetLocation?: ( position: IFpsGeolocationPosition ) => void; // Handler for the value
//   onSubmit?: ( position: IFpsGeolocationPosition ) => void; // Handler for the value
//   enableDetails?: boolean; // true by default
//   allowEditing?: boolean; // false by default
//   showAltitude?: boolean;
// }

// export interface IFpsGeolocationPosition {
//   timestamp: number; // in milliseconds since the Unix epoch
//   localTime: string;
//   coords: IFpsGeolocationCoordinates;
//   status: string;
//   message: string;
//   error: IFpsGeolocationPositionError | undefined;
// }

// export interface IFpsGeolocationCoordinates {
//   accuracy: number; // in meters
//   latitude: number; // in degrees
//   longitude: number; // in degrees
//   altitude: number | undefined; // in meters, or null if not available
//   altitudeAccuracy: number | undefined; // in meters, or null if not available
//   heading: number | undefined; // in degrees, or null if not available
//   speed: number | undefined; // in meters per second, or null if not available
// }

// export interface IFpsGeolocationPositionError {
//   code: IFpsGeolocationPositionErrorCode; // A numeric code indicating the error type
//   message: string; // A human-readable string providing more details about the error
//   // The following properties may be included, but are optional
//   PERMISSION_DENIED?: number; // Code indicating permission was denied
//   POSITION_UNAVAILABLE?: number; // Code indicating position data is unavailable
//   TIMEOUT?: number; // Code indicating the request timed out
// }

// // Define the error codes as an enum for better type safety
// export enum IFpsGeolocationPositionErrorCode {
//   PERMISSION_DENIED = 1,
//   POSITION_UNAVAILABLE = 2,
//   TIMEOUT = 3,
// }