import * as React from 'react';
import { useState, useEffect } from 'react';

const FileUpload: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (items) {
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                // for (const item of items) {
                //     if (item.type.indexOf('image') !== -1) {
                        const file = items[i].getAsFile();
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                setImageSrc(e.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                }
            }
        };

        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    const handleFileSave = () => {
        if (imageSrc) {
            const link = document.createElement('a');
            link.href = imageSrc;
            link.download = 'c:/image.png'; // Adjust this as needed
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            {imageSrc && <img src={imageSrc} alt="Pasted Image" style={{ maxWidth: '100%', height: 'auto' }} />}
            <button onClick={handleFileSave} disabled={!imageSrc}>Save File</button>
        </div>
    );
};

export default FileUpload;
