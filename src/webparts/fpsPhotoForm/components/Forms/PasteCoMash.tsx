import * as React from 'react';
import { useState, FormEvent, useEffect, } from 'react';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl'

// Constants for the list title
const ListTitle: string = 'PhotoFormMC';

export interface IPhotoFormForm  {
  SiteUrl: string;
  ListTitle: string;
  LibraryName: string;
  Category1s: string[];
  Category2s: string[];
  Category3s: string[];
}

// interface FileUploadProps {
//   siteUrl: string;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ siteUrl }) => {

const ScreenshotFormMash: React.FC<IPhotoFormForm> = ( props ) => {
  const { SiteUrl, ListTitle, LibraryName, Category1s, Category2s, Category3s } = props;
// export default function ScreenshotFormMash({ SiteUrl }: { SiteUrl: string }) {
    const [imageData, setImageData] = useState<string | null>(null);
    const [formData, setFormData] = useState({ category1: 0, category2: [], category3: [], title: '', comments: '', x: 0, y: 0, z: 0 });
    const [cats2Comments, setCats2Comments ] = useState<boolean>(true);
    const [cats2Title, setCats2Title ] = useState<boolean>(false);

    // Handle pasting the image from the clipboard
    const handlePaste = (e: ClipboardEvent) => {
        const clipboardItems = e.clipboardData?.items;
        for (let i = 0; i < clipboardItems?.length; i++) {
            if (clipboardItems[i].type.indexOf('image') !== -1) {
                const file = clipboardItems[i].getAsFile();
                const reader = new FileReader();
                reader.onloadend = function () {
                    setImageData(reader.result as string); // Store the base64 image data
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // Create list item in SharePoint
    const createListItem = async (title: string): Promise<any> => {
        const requestDigest = await getThisFPSDigestValueFromUrl(SiteUrl);
        const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('${ListTitle}')/items`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-RequestDigest': requestDigest
            },
            body: JSON.stringify({ Title: title })
        });
        const data = await response.json();
        return data;
    };

    // Convert base64 image to a Blob
    const base64ToBlob = (base64: string): Blob => {
        const binary = atob(base64.split(',')[1]);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/png' });
    };

    // Upload image to SiteAssets library
    const uploadImageToLibrary = async (blob: Blob, fileName: string): Promise<string | null> => {
        const requestDigest = await getThisFPSDigestValueFromUrl(SiteUrl);
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onloadend = async () => {
                const buffer = fileReader.result as ArrayBuffer;
                try {
                    const response = await fetch(`${SiteUrl}/_api/web/GetFolderByServerRelativeUrl('${LibraryName}')/Files/add(url='${fileName}', overwrite=true)`, {
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
    };

    // Update list item with image URL
    const updateListItemWithImage = async (itemId: number, imageUrl: string):Promise<void> => {
        const requestDigest = await getThisFPSDigestValueFromUrl(SiteUrl);
        const body = { ScreenshotUrl: imageUrl }; // Assuming ScreenshotUrl is the name of your image column
        try {
            const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('${ListTitle}')/items(${itemId})`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-RequestDigest': requestDigest,
                    'If-Match': '*'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Failed to update list item');
            }
        } catch (error) {
            console.error('Error during list item update:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!formData.title || !imageData) {
            alert('Please provide a title and paste an image');
            return;
        }

        const listItemResponse = await createListItem(formData.title);
        let fileDesc = [ `${ Category1s[formData.category1 ]}` ];
        fileDesc.push( `X${formData.x}_Y${formData.y}_Z${formData.z}` );
        formData.category2.map( idx => { if ( formData.title.indexOf( Category2s[ idx ] ) < 0 ) fileDesc.push( Category2s[ idx ] ); });
        formData.category3.map( idx => { if ( formData.title.indexOf( Category3s[ idx ] ) < 0 ) fileDesc.push( Category3s[ idx ] ); });
        fileDesc.push( `${formData.title}` );

        const fileName = `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}_${ fileDesc.join('_') }.png`;
        const blob = base64ToBlob(imageData);
        const imageUrl = await uploadImageToLibrary(blob, fileName);

        if (imageUrl) {
            await updateListItemWithImage(listItemResponse.Id, imageUrl);
            alert('Item created and image uploaded successfully!');
        } else {
            alert('Failed to upload the image.');
        }
    };

    useEffect(() => {
        const handleClipboard = (e: ClipboardEvent): void => handlePaste(e);
        document.addEventListener('paste', handleClipboard);
        return () => {
            document.removeEventListener('paste', handleClipboard);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} onPaste={handlePaste as any}>
            <div style={{ margin: '1em' }}>
                <h4>Expecting the following site structure</h4>
                <ul>
                    <li>List with name: {`'PhotoFormMC'`}</li>
                    <li>Title column: {`Comes with default list`}</li>
                    <li>Text column called {`'ScreenshotUrl'`}</li>
                    <li>SiteAssets library {`Titled as "Site Assets" with the space - should be default`}</li>
                </ul>
            </div>

            <div style={{ margin: '1em', display: 'flex', gap: '1em' }}>
              <div style={{ margin: '1em' }}>
                <label>Category 1</label>
                <div>
                  {Category1s.map((category, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, category1: index })}
                      style={{ margin: '0.5em', background: formData.category1 === index ? 'darkgreen' : '', color: formData.category1 === index ? 'white' : '',  }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>


            <div style={{ margin: '1em' }}>
                <label>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em' }} />
            </div>
            <div style={{ margin: '1em' }}>
                <label>Comments</label>
                <textarea value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em', width: '100%', height: '100px' }} />
            </div>
            <div style={{ margin: '1em' }}>
                <label>X</label>
                <input type="number" value={formData.x} onChange={e => setFormData({ ...formData, x: Number(e.target.value) })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em' }} />
            </div>
            <div style={{ margin: '1em' }}>
                <label>Y</label>
                <input type="number" value={formData.y} onChange={e => setFormData({ ...formData, y: Number(e.target.value) })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em' }} />
            </div>
            <div style={{ margin: '1em' }}>
                <label>Z</label>
                <input type="number" value={formData.z} onChange={e => setFormData({ ...formData, z: Number(e.target.value) })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em' }} />
            </div>

            <div style={{ margin: '1em' }}>
                <button type="submit">Submit</button>
            </div>
            {imageData && (
                <div>
                    <h3>Pasted Image Preview:</h3>
                    <img src={imageData} alt="Pasted Image" style={{ maxWidth: '300px' }} />
                </div>
            )}
        </form>
    );
}

export default ScreenshotFormMash;