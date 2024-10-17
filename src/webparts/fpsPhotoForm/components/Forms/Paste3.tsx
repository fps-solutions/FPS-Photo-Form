import * as React from 'react';
import { useState, useEffect } from 'react';

const FileUpload: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const clipboardItems = e.clipboardData?.items;
            for (let i = 0; i < clipboardItems?.length; i++) {
                if (clipboardItems[i].type.indexOf('image') !== -1) {
                    const file = clipboardItems[i].getAsFile();
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        setImageSrc(reader.result as string);
                        uploadToSharePoint(reader.result as string);
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

    const uploadToSharePoint = async (base64Image: string) => {
        const siteUrl = "https://your-sharepoint-site-url";
        const libraryRelativeUrl = "SiteAssets";
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `image_${timestamp}.png`;

        const binary = atob(base64Image.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });

        const fileReader = new FileReader();
        fileReader.onload = async () => {
            const buffer = fileReader.result as ArrayBuffer;

            const response = await fetch(`${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${libraryRelativeUrl}')/Files/add(url='${fileName}', overwrite=true)`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; odata=verbose',
                    'X-RequestDigest': document.getElementById('__REQUESTDIGEST')!.value,
                    'Content-Length': buffer.byteLength.toString()
                },
                body: buffer
            });

            if (response.ok) {
                console.log('File uploaded successfully');
            } else {
                console.error('File upload failed');
            }
        };
        fileReader.readAsArrayBuffer(blob);
    };

    return (
        <div>
            {imageSrc && <img src={imageSrc} alt="Pasted Image" style={{ maxWidth: '100%', height: 'auto' }} />}
        </div>
    );
};

export default FileUpload;
