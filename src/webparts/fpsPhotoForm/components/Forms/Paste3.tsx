import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl'

const FileUpload: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const fileReaderRef = useRef<FileReader | null>(null);

    const uploadToSharePoint = useCallback(async (base64Image: string) => {
        const siteUrl = "https://fuzzypawstech.sharepoint.com/sites/PhotoFormWebpart";
        const libraryRelativeUrl = "SiteAssets";
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `image_${timestamp}.png`;

        const binary = atob(base64Image.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });

        return new Promise<void>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onloadend = async () => {
                const buffer = fileReader.result as ArrayBuffer;

                try {
                  const requestDigest = await getThisFPSDigestValueFromUrl(siteUrl);
                    const response = await fetch(`${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryRelativeUrl}')/Files/add(url='${fileName}', overwrite=true)`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json; odata=verbose',
                            'X-RequestDigest': requestDigest,
                            'Content-Length': buffer.byteLength.toString()
                        },
                        body: buffer
                    });

                    if (response.ok) {
                        console.log('File uploaded successfully');
                        resolve();
                    } else {
                        console.error('File upload failed');
                        reject(new Error('File upload failed'));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    reject(error);
                }
            };
            fileReader.readAsArrayBuffer(blob);
        });
    }, []);

    const handleUploadClick = async () => {
        if (imageSrc) {
            await uploadToSharePoint(imageSrc);
        }
    };

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const clipboardItems = e.clipboardData?.items;
            for (let i = 0; i < clipboardItems?.length; i++) {
                if (clipboardItems[i].type.indexOf('image') !== -1) {
                    const file = clipboardItems[i].getAsFile();
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        const base64Image = reader.result as string;
                        setImageSrc(base64Image);
                    };
                    reader.readAsDataURL(file);
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <div>
            {imageSrc && <button onClick={handleUploadClick}>Save to SharePoint</button>}
            {imageSrc && <img src={imageSrc} alt="Pasted Image" style={{ maxWidth: '100%', height: 'auto' }} />}
        </div>
    );
};

export default FileUpload;
