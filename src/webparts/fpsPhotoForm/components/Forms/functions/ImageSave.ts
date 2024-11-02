
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
  const { absoluteWebUrl, listTitle, subFolder } =  ImagesSource;

    const requestDigest = await getThisFPSDigestValueFromUrl(absoluteWebUrl);
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = async () => {
            const buffer = fileReader.result as ArrayBuffer;
            const folderRelativeUrl = subFolder ? `${listTitle}/${ImagesSource.subFolder}` : listTitle;
            try {
                const response = await fetch(`${absoluteWebUrl}/_api/web/GetFolderByServerRelativeUrl('${folderRelativeUrl}')/Files/add(url='${fileName}', overwrite=true)`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json; odata=verbose',
                        'X-RequestDigest': requestDigest,
                        'Content-Length': buffer.byteLength.toString()
                    },
                    body: buffer
                });

                if (response.ok) {
                    const data = await response.json();
                    const imageUrl = data.d.ServerRelativeUrl;
                    resolve(imageUrl);
                } else {
                    reject(new Error('File upload failed'));
                }
            } catch (error) {
                reject(error);
            }
        };
        fileReader.readAsArrayBuffer(blob);
    });
}


