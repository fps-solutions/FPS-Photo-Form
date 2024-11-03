
import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl';

// 2024-11-02:  https://github.com/fps-solutions/FPS-Photo-Form/issues/66

// Convert base64 image to a Blob
export const base64ToBlob = (base64: string): Blob => {
  const binary = atob(base64.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' });
};

export async function uploadBase64ImageToLibrary( ImagesSource: ISourceProps, base64: string, fileName: string ): Promise<string | null> {
  const blob = base64ToBlob(base64);
  const imageUrl = await uploadImageToLibrary( ImagesSource, blob, fileName );
  return imageUrl;
}

// Upload image to SiteAssets library
export async function uploadImageToLibrary(ImagesSource: ISourceProps, blob: Blob, fileName: string): Promise<string | null> {
  // Destructure properties from ImagesSource for easier access
  const { absoluteWebUrl, listTitle, subFolder } = ImagesSource;

  // Retrieve the request digest value necessary for SharePoint authentication
  const requestDigest = await getThisFPSDigestValueFromUrl(absoluteWebUrl);

  // Return a new Promise for handling the asynchronous file upload
  return new Promise((resolve, reject) => {
    // Create a FileReader to read the Blob data
    const fileReader = new FileReader();

    // Event handler for when the file reading is complete
    fileReader.onloadend = async () => {
      // Get the result as an ArrayBuffer
      const buffer = fileReader.result as ArrayBuffer;

      // Determine the folder path where the file will be uploaded
      const folderRelativeUrl = subFolder ? `${listTitle}/${ImagesSource.subFolder}` : listTitle;

      try {
        // Make a POST request to the SharePoint REST API to upload the file
        const response = await fetch(`${absoluteWebUrl}/_api/web/GetFolderByServerRelativeUrl('${folderRelativeUrl}')/Files/add(url='${fileName}', overwrite=true)`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json; odata=verbose', // Accept JSON response
            'X-RequestDigest': requestDigest, // Include the request digest for validation
            'Content-Length': buffer.byteLength.toString() // Set content length for the upload
          },
          body: buffer // Set the body of the request to the ArrayBuffer
        });

        // Check if the response is OK (status code 200-299)
        if (response.ok) {
          const data = await response.json(); // Parse the JSON response
          const imageUrl = data.d.ServerRelativeUrl; // Get the server-relative URL of the uploaded image
          resolve(imageUrl); // Resolve the promise with the image URL
        } else {
          reject(new Error('File upload failed')); // Reject if the upload fails
        }
      } catch (error) {
        reject(error); // Reject the promise if there’s an error during the fetch
      }
    };

    // Start reading the Blob as an ArrayBuffer
    fileReader.readAsArrayBuffer(blob);
  });
}
