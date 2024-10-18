import * as React from 'react';
import { useState, FormEvent, useEffect, } from 'react';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl';

import styles from '../FpsPhotoForm.module.scss';

const ButtonStyles = [
  {
    label: 'Overworld',
    styles: { background: 'green', color: 'white' }
  },
  {
    label: 'Nether',
    styles: { background: 'orange', color: 'black' }
  },
  {
    label: 'End',
    styles: { background: 'gray', color: 'yellow' }
  },
];

export function getButtonStyles( label: string ): any {
  let results = {};
  ButtonStyles.map( but => {
    if ( but.label === label ) results = but.styles;
  });
  return results;
}

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

        const saveItem = {
          Title: title,
          Category1: Category1s[ formData.category1 ],
          CoordX: formData.x,
          CoordY: formData.y,
          CoordZ: formData.z,
          Notes: formData.comments,
        }

        const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('${ListTitle}')/items`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-RequestDigest': requestDigest
            },
            body: JSON.stringify( saveItem )
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

    const handleCategory2Click = (index: number) => {
      setFormData(prevFormData => {
        const indexInArray = prevFormData.category2.indexOf(index);
        let newCategory2;
        if (indexInArray > -1) {
          // Remove the index if it's already in the array
          newCategory2 = prevFormData.category2.filter(i => i !== index);
        } else {
          // Add the index if it's not in the array
          newCategory2 = [...prevFormData.category2, index];
        }
        return { ...prevFormData, category2: newCategory2 };
      });
    };

    const handleCategory3Click = (index: number) => {
      setFormData(prevFormData => {
        const indexInArray = prevFormData.category3.indexOf(index);
        let newCategory3;
        if (indexInArray > -1) {
          // Remove the index if it's already in the array
          newCategory3 = prevFormData.category3.filter(i => i !== index);
        } else {
          // Add the index if it's not in the array
          newCategory3 = [...prevFormData.category3, index];
        }
        return { ...prevFormData, category3: newCategory3 };
      });
    };

    const numberFields = ['x', 'y', 'z'];

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
                      className={ formData.category1 === index ? [ styles.button, styles.selected ].join(' ') : styles.button }
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, category1: index })}
                      style={ {...{ }, ...getButtonStyles( Category1s[ index ] ) } }
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

            {numberFields.map(field => (
              <div key={field} style={{ margin: '1em' }}>
                <label>{field.toUpperCase()}</label>
                <input
                  type="text"
                  value={formData[ `${field}` as 'x' ]}
                  onChange={e => {
                    const value = e.target.value;
                    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
                      setFormData({ ...formData, [field]: value });
                    }
                  }}
                  onBlur={() => {
                    setFormData({ ...formData, [field]: Number(formData[ `${field}` as 'x' ]) });
                  }}
                  style={{ paddingLeft: '.5em', marginLeft: '1em' }}
                />
              </div>
            ))}
{/*
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
            </div> */}

            <div style={{ margin: '1em' }}>
                <button type="submit">Submit</button>
            </div>
            {imageData && (
                <div>
                    <h3>Pasted Image Preview:</h3>
                    <img src={imageData} alt="Pasted Image" style={{ maxWidth: '300px' }} />
                </div>
            )}

              <div style={{ margin: '1em' }} className={ styles.category2Buttons }>
                <label>Category 2</label>
                <div>
                {Category2s.map((category, index) => (
                  <button
                    className={formData.category2.indexOf(index) > -1 ?  [ styles.button, styles.selected ].join(' ') : styles.button }
                    key={index}
                    type="button"
                    onClick={() => handleCategory2Click(index)}
                    style={ {...{ }, ...getButtonStyles( Category2s[ index ] ) } }
                  >
                    {category}
                  </button>
                ))}
                </div>
              </div>

              <div style={{ margin: '1em' }} className={ styles.category3Buttons }>
                <label>Category 3</label>
                <div>
                {Category3s.map((category, index) => (
                  <button
                    className={formData.category3.indexOf(index) > -1 ?  [ styles.button, styles.selected ].join(' ') : styles.button }
                    key={index}
                    type="button"
                    onClick={() => handleCategory3Click(index)}
                    style={ {...{ }, ...getButtonStyles( Category3s[ index ] ) } }
                  >
                    {category}
                  </button>
                ))}
                </div>
              </div>

        </form>
    );
}

export default ScreenshotFormMash;