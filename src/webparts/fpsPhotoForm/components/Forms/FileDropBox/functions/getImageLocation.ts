
/**
 * EXAMPLE on Usage:
 *
 *
 */
// try {
//   const file = /* your file input here */;
//   const metadata = await extractImageLocationData(file);
//   console.log('Extracted Metadata:', metadata);
// } catch (error) {
//   console.error('Error extracting metadata:', error);
// }

// Result would be something like this:

// {
//   "filename": "example.jpg",
//   "latitude": 34.204125,
//   "longitude": -118.407256,
//   "hasGpsData": true,
//   "humanReadable": "34.204125 N, -118.407256 W",
//   "timestamp": "2024:11:18 12:30:00",
//   "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64 string)",
//   "dimensions": "1800x900",
//   "additionalData": { /* Other EXIF metadata */ }
// }

export interface IImageLocationData {
  filename: string;
  latitude?: number; // Human-readable decimal latitude
  longitude?: number; // Human-readable decimal longitude
  hasGpsData: boolean;
  humanReadable?: string; // Formatted string like "102.43234 N, -32.432434 W"
  timestamp?: string; // Date and time when the image was captured
  thumbnail?: string; // Base64-encoded thumbnail image
  dimensions?: string; // Image dimensions in 'width x height' format
  orientation?: number; // Image orientation (1 to 8, see below)
  additionalData?: Record<string, any>; // Any other useful EXIF data
}

/**
 * Orientation Values (EXIF Orientation Tag) Interpretation:
    1 = Normal (no rotation)
    2 = Flipped horizontally
    3 = Rotated 180 degrees
    4 = Flipped vertically
    5 = Rotated 90 degrees counterclockwise and flipped horizontally
    6 = Rotated 90 degrees counterclockwise
    7 = Rotated 90 degrees clockwise and flipped horizontally
    8 = Rotated 90 degrees clockwise
 */
    import * as EXIF from 'exif-js';

    /**
     * Extracts location, timestamp, image dimensions, orientation, and other useful metadata from an image file.
     * @param file - The image file to process.
     * @returns An object implementing IImageLocationData.
     */
    export async function extractImageLocationData(image: File  | string ): Promise<IImageLocationData> {

      if ( !image ) return {
          hasGpsData: false,
          filename: 'NoFileProvided',
          humanReadable: 'getExifData ERROR ~ 65',
          additionalData: {status: 'Error' },
        };

      // Check if it's a File object (from camera or file input)
      if (image instanceof File) {
        if (!image || !image.type.startsWith('image/')) {
          throw new Error('Invalid file. Please provide a valid image file.');
        }

        const arrayBuffer = await readFileAsArrayBuffer(image);
        return await getExifData(arrayBuffer, image);

      // Handle image data URL (base64 string or data URL format)
      } else if (typeof image === 'string') {
        // Decode the base64 string into binary data
        const base64Data = image.split(',')[1]; // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const binaryString = atob(base64Data);
        const binaryData = new Uint8Array(binaryString.length);

        for (let i = 0; i < binaryString.length; i++) {
          binaryData[i] = binaryString.charCodeAt(i);
        }

        return await getExifData(binaryData.buffer, { name: 'Clipboard.png', type: 'image/png' } as File);

      }
    }

    /**
     * Reads a file as an ArrayBuffer.
     * @param file - The file to read.
     * @returns An ArrayBuffer of the file's data.
     */
    async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
      const reader = new FileReader();

      return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsArrayBuffer(file);
      });
    }

/**
 * Extracts EXIF data from an image file, including location, timestamp, orientation, and more.
 * @param arrayBuffer - The ArrayBuffer of the image file.
 * @param file - The image file object.
 * @returns A promise resolving to an object containing image metadata.
 */
async function getExifData(arrayBuffer: ArrayBuffer, file: File): Promise<IImageLocationData> {
  console.log( 'getExifData ~ 116 - Starting' );
  return new Promise((resolve, reject) => {
    try {
      // Convert ArrayBuffer to a Blob, then create an object URL
      const blob = new Blob([arrayBuffer], { type: file.type });
      const imageUrl = URL.createObjectURL(blob);

      // Use the imageUrl with EXIF.getData() to extract metadata
      EXIF.getData(imageUrl, function () {
        // Extract GPS tags
        const gpsLatitude = EXIF.getTag(this, 'GPSLatitude');
        const gpsLongitude = EXIF.getTag(this, 'GPSLongitude');
        const gpsLatitudeRef = EXIF.getTag(this, 'GPSLatitudeRef');
        const gpsLongitudeRef = EXIF.getTag(this, 'GPSLongitudeRef');
        const additionalData = EXIF.getAllTags(this);

        // Extract timestamp (DateTimeOriginal)
        const timestamp = EXIF.getTag(this, 'DateTimeOriginal') || undefined;

        // Extract thumbnail (if available)
        const thumbnail = EXIF.getTag(this, 'Thumbnail') || undefined;

        // Extract image dimensions
        const imageWidth = EXIF.getTag(this, 'PixelXDimension');
        const imageHeight = EXIF.getTag(this, 'PixelYDimension');
        const dimensions = imageWidth && imageHeight ? `${imageWidth}x${imageHeight}` : undefined;

        // Extract image orientation
        const orientation = EXIF.getTag(this, 'Orientation');

        let latitude: number | undefined;
        let longitude: number | undefined;
        let humanReadable: string | undefined;

        if (gpsLatitude && gpsLongitude) {
          // Convert GPS coordinates to decimal format
          latitude =
            (gpsLatitude[0] +
              gpsLatitude[1] / 60 +
              gpsLatitude[2] / 3600) *
            (gpsLatitudeRef === 'S' ? -1 : 1);

          longitude =
            (gpsLongitude[0] +
              gpsLongitude[1] / 60 +
              gpsLongitude[2] / 3600) *
            (gpsLongitudeRef === 'W' ? -1 : 1);

          // Create human-readable string
          const latDirection = gpsLatitudeRef || '';
          const lonDirection = gpsLongitudeRef || '';
          humanReadable = `${latitude.toFixed(6)} ${latDirection}, ${longitude.toFixed(6)} ${lonDirection}`;
        }

        // Convert thumbnail to base64 (if present)
        const base64Thumbnail = thumbnail ? `data:image/jpeg;base64,${thumbnail}` : undefined;

        resolve({
          filename: file.name,
          latitude,
          longitude,
          hasGpsData: !!(latitude && longitude),
          humanReadable,
          timestamp,
          thumbnail: base64Thumbnail,
          dimensions,
          orientation, // Adding orientation to the result
          additionalData, // Optional additional EXIF metadata
        });
      });
    } catch (error) {
      alert( `getExifData ~ 179 - Unknown error getting ImageInfo... See console.` );
      console.log( `getExifData ~ 179 - arrayBuffer, file:`, arrayBuffer, file, );

      reject( {
          filename: file.name,
          humanReadable: 'getExifData ERROR ~ 191',
          additionalData: {status: 'Error' },
        });
    }
  });
}