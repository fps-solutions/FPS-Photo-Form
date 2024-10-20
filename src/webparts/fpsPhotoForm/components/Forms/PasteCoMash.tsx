import * as React from 'react';
import { useState, FormEvent, useEffect, } from 'react';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl';

import styles from '../FpsPhotoForm.module.scss';
import { getButtonStyles } from './getButtonStyles';
import FPSToggle from '../Toggle/component';

export interface IPhotoFormForm  {
  SiteUrl: string;
  ListTitle: string;
  LibraryName: string;
  Category1s: string[];
  Category2s: string[];
  Category3s: string[];
}

export interface IPhotoFormFormInterface {
  category1: number;
  category2: number[];
  category3: number[];
  title: string;
  comments: string;
  x: number;
  y: number;
  z: number;
}

const PlaceHolderCategories: string[] = [ "TBD", "NA", ];
const EmptyFormData: IPhotoFormFormInterface = { category1: null, category2: [], category3: [], title: '', comments: '', x: 0, y: 0, z: 0 };

const ScreenshotFormMash: React.FC<IPhotoFormForm> = ( props ) => {
  const { SiteUrl, ListTitle, LibraryName, Category1s, Category2s, Category3s } = props;
  const ActualCat2s =Category2s.filter(item => PlaceHolderCategories.indexOf( item ) < 0 );
  const ActualCat3s = Category3s.filter(item => PlaceHolderCategories.indexOf( item ) < 0 );
// export default function ScreenshotFormMash({ SiteUrl }: { SiteUrl: string }) {
    const [imageData, setImageData] = useState<string | null>(null);
    const [formData, setFormData] = useState<IPhotoFormFormInterface>( EmptyFormData );
    const [autoClear, setAutoClear ] = useState<boolean>( true );
    const [wasSubmitted, setWasSubmitted ] = useState<boolean>(false);
    const [cats2Comments, setCats2Comments ] = useState<boolean>(true);
    const [cats2Title, setCats2Title ] = useState<boolean>(false);

    // Update wasSubmitted to false whenever formData changes
    useEffect(() => {
      setWasSubmitted(false);
    }, [formData]);

    const handleToggleChange = (checked: boolean) => {
      setAutoClear(checked); // Update the state when toggle changes
    };

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
          Category1: Category1s[formData.category1],
          Category2: formData.category2.map((idx: number) => Category2s[idx]),
          Category3: formData.category3.map((idx: number) => Category3s[idx]),

          // NOTE for SE:  You may need this more complex object
          // Category2: {
          //   "__metadata": { "type": "Collection(Edm.String)" },
          //   "results": formData.category2.map(idx => Category2s[idx])
          // },
          // Category3: {
          //     "__metadata": { "type": "Collection(Edm.String)" },
          //     "results": formData.category3.map(idx => Category3s[idx])
          // },

          CoordX: formData.x,
          CoordY: formData.y,
          CoordZ: formData.z,
          Notes: formData.comments,
      };

      console.log('Save Item:', saveItem);

      try {
          const response = await fetch(`${SiteUrl}/_api/web/lists/getbytitle('${ListTitle}')/items`, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-RequestDigest': requestDigest
              },
              body: JSON.stringify(saveItem)
          });

          if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response:', errorText);
              throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('Response Data:', data);
          return data;
      } catch (error) {
          console.error('Error creating list item:', error);
          throw error;
      }
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
        let shortFileName = fileName.length > 190 ? `${fileName.substring(0, 190)}...and more_.png` : fileName;

        // remove special characters from the filename:  https://github.com/fps-solutions/FPS-Photo-Form/issues/9
        shortFileName = shortFileName.replace(/[\\/:*?"<>|#&]/g, '' );
        const blob = base64ToBlob(imageData);

        const imageUrl = await uploadImageToLibrary( blob, shortFileName );

        if (imageUrl) {
            await updateListItemWithImage(listItemResponse.Id, imageUrl);
            setWasSubmitted( true );
            if ( autoClear === true ) setFormData( EmptyFormData );
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

    const handleCategory2Click = (index: number): void => {
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

        // https://github.com/fps-solutions/FPS-Photo-Form/issues/6
        const clickedActual = PlaceHolderCategories.indexOf( Category2s[index] ) < 0 ? true : false;
        newCategory2 = newCategory2.filter(function(index) {
          return clickedActual ? PlaceHolderCategories.indexOf(Category2s[index]) === -1 : PlaceHolderCategories.indexOf(Category2s[index]) > -1;
        });

        return { ...prevFormData, category2: newCategory2 };
      });
    };

    const handleCategory3Click = (index: number): void => {
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

        // https://github.com/fps-solutions/FPS-Photo-Form/issues/6
        const clickedActual = PlaceHolderCategories.indexOf( Category3s[index] ) < 0 ? true : false;
        newCategory3 = newCategory3.filter(function(index) {
          return clickedActual ? PlaceHolderCategories.indexOf(Category3s[index]) === -1 : PlaceHolderCategories.indexOf(Category3s[index]) > -1;
        });

        return { ...prevFormData, category3: newCategory3 };
      });
    };

    const { title, x, y, z, category1, category2, category3 } = formData;
    const disableSubmit = wasSubmitted !== true && title && x !== null && y !== null && z !== null && typeof category1 === 'number' && category1 > -1 && category2.length > 0  && category3.length > 0 ? false : true;

    const numberFields = ['x', 'y', 'z'];

    return (
        <form className={ styles.fpsPhotoFormGrid }
          onSubmit={handleSubmit} onPaste={handlePaste as any}>

            <div className={ styles.category1 } style={{ display: 'flex', gap: '1em' }}>
              <div style={{ }}>
              <h4 style={{ margin: '0px' }}>Category 1</h4>
                <div className={ styles.categoryButtons }>
                  {Category1s.map((category, index) => (
                    <button
                      className={ formData.category1 === index ? [ styles.button, styles.selected ].join(' ') : styles.button }
                      key={index}
                      title={ category }
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

            <div className={ styles.title }style={{  }}>
                <label>Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em' }} />
            </div>

            <div className={ styles.coordinates }>
              {numberFields.map(field => (
                <div key={field} style={{ margin: '1em 1em 1em 0em' }}>
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
            </div>

            <div className={ styles.comments }style={{  }}>
                <label>Comments</label>
                <textarea value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em', width: 'calc(100% - 2em)', height: '100px' }} />
            </div>

              <div style={{ marginLeft: '1em' }} className={ styles.category2 }>
                <h4 style={{ margin: '0px' }}>Category 2</h4>
                <div className={ styles.categoryButtons } style={{ display: 'grid' }}>
                  {Category2s.map((category, index) => (
                    <button
                      className={formData.category2.indexOf(index) > -1 ?  [ styles.button, styles.selected ].join(' ') : styles.button }
                      key={index}
                      title={ category }
                      type="button"
                      onClick={() => handleCategory2Click(index)}
                      style={ {...{  }, ...getButtonStyles( Category2s[ index ] ) } }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginLeft: '1em' }} className={ styles.category3 }>
                <h4 style={{ margin: '0px' }}>Category 3</h4>
                <div className={ styles.categoryButtons } style={{ display: 'grid' }}>
                  {Category3s.map((category, index) => (
                    <button
                      className={formData.category3.indexOf(index) > -1 ?  [ styles.button, styles.selected ].join(' ') : styles.button }
                      key={index}
                      title={ category }
                      type="button"
                      onClick={() => handleCategory3Click(index)}
                      style={ {...{  }, ...getButtonStyles( Category3s[ index ] ) } }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className={ styles.summary }>
                <div>
                  <h4 style={{ margin: '0px 0px 5px 0px'}}>Category 2s:</h4>
                  { formData.category2.map( idx => Category2s[ idx ]).join(' | ') }
                </div>
                <div>
                <h4 style={{ margin: '10px 0px 5px 0px'}}>Category 3s:</h4>
                  { formData.category3.map( idx => Category3s[ idx ]).join(' | ') }
                </div>
              </div>

              <div className={ styles.submit } style={{ margin: '1em 1em 1em 0em' }}>
                <button disabled={ disableSubmit } className={ styles.submitButton }type="submit">Submit</button>
                {/* <button className={ styles.submitButton }type="reset" onClick={ () => setFormData( EmptyFormData )}>Reset</button> */}
                <button className={ styles.clearButton }type="reset" onClick={ () => setFormData( EmptyFormData )}>Reset</button>

                <FPSToggle
                  label="Reset on Create"
                  onText="Auto"
                  offText="Manual"
                  onChange={ handleToggleChange }
                />
                <div>Current Toggle State: { `${autoClear}` }</div>

              </div>
              {imageData && (
                <div className={ styles.imagePreview }>
                    <h3>Pasted Image Preview:</h3>
                    <img src={imageData} alt="Pasted Image" style={{ maxWidth: '300px' }} />
                </div>
              )}
           <div className={ styles.spacer }/>

        </form>
    );
}

export default ScreenshotFormMash;