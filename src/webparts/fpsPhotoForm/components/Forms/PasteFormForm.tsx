import * as React from 'react';
import { useState, FormEvent, useEffect, } from 'react';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl';

import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';

import styles from '../FpsPhotoForm.module.scss';
import FPSToggle from '../Toggle/component';
import { IPhotoButtonStyle } from './IScatterChartProps';
import { uploadBase64ImageToLibrary } from './functions/ImageSave';
import { categoryButtons } from './PasteFormPieces';
import { handleImagePaste } from './functions/handlePasteImage';
import ImagePaste from './Camera/ClipboardImage/fps-ImagePaste';

export interface IPhotoFormForm  {

  ListSiteUrl: string;
  ListTitle: string;
  LibrarySiteUrl: string;
  LibraryName: string;

  // https://github.com/fps-solutions/FPS-Photo-Form/issues/24
  imageSubfolder2: string;

  Category1s: string[];
  Category2s: string[];
  Category3s: string[];

  ListSource: ISourceProps;
  ImagesSource: ISourceProps;
  photoButtonStyles: IPhotoButtonStyle[];

}

export interface IPhotoFormInput extends IPhotoFormForm {
  display: 'block' | 'none';
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

const ScreenshotFormMash: React.FC<IPhotoFormInput> = ( props ) => {
  const { display, ListSource, ImagesSource, Category1s, Category2s, Category3s, } = props; // ListSiteUrl, ListTitle, LibrarySiteUrl, LibraryName,

    const [imageData, setImageData] = useState<string | null>(null);
    const [formData, setFormData] = useState<IPhotoFormFormInterface>( EmptyFormData );
    const [autoClear, setAutoClear ] = useState<boolean>( true );
    const [wasSubmitted, setWasSubmitted ] = useState<boolean>(false);

    // Update wasSubmitted to false whenever formData changes
    useEffect(() => {
      setWasSubmitted(false);
    }, [formData]);

    const handleToggleChange = (checked: boolean): void => {
      setAutoClear(checked); // Update the state when toggle changes
    };

    // useEffect(() => {
    //   const handleClipboard = (e: ClipboardEvent): void => handleImagePaste(e, setImageData );
    //   document.addEventListener('paste', handleClipboard);
    //   return () => {
    //       document.removeEventListener('paste', handleClipboard);
    //   };
    // }, []);

    // Conditionally return null or undefined if shouldRender is false
    if ( display === 'none' ) {
      return null; // or return undefined;
    }

    // Create list item in SharePoint
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createListItem = async (title: string): Promise<any> => {
      const requestDigest = await getThisFPSDigestValueFromUrl(ListSource.absoluteWebUrl);

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
          const response = await fetch(`${ListSource.absoluteWebUrl}/_api/web/lists/getbytitle('${ListSource.listTitle}')/items`, {
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

    // Update list item with image URL
    const updateListItemWithImage = async (itemId: number, imageUrl: string):Promise<void> => {
        const requestDigest = await getThisFPSDigestValueFromUrl(ListSource.absoluteWebUrl);
        const body = { ScreenshotUrl: imageUrl }; // Assuming ScreenshotUrl is the name of your image column
        try {
            const response = await fetch(`${ListSource.absoluteWebUrl}/_api/web/lists/getbytitle('${ListSource.listTitle}')/items(${itemId})`, {
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
        const fileDesc = [ `${ Category1s[formData.category1 ]}` ];
        fileDesc.push( `X${formData.x}_Y${formData.y}_Z${formData.z}` );
        formData.category2.map( idx => { if ( formData.title.indexOf( Category2s[ idx ] ) < 0 ) fileDesc.push( Category2s[ idx ] ); });
        formData.category3.map( idx => { if ( formData.title.indexOf( Category3s[ idx ] ) < 0 ) fileDesc.push( Category3s[ idx ] ); });
        fileDesc.push( `${formData.title}` );

        const fileName = `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}_${ fileDesc.join('_') }.png`;
        let shortFileName = fileName.length > 190 ? `${fileName.substring(0, 190)}...and more_.png` : fileName;

        // remove special characters from the filename:  https://github.com/fps-solutions/FPS-Photo-Form/issues/9
        shortFileName = shortFileName.replace(/[\\/:*?"<>|#&]/g, '' );

        // const blob = base64ToBlob(imageData);

        const imageUrl = await uploadBase64ImageToLibrary( ImagesSource, imageData, shortFileName );

        if (imageUrl) {
            await updateListItemWithImage(listItemResponse.Id, imageUrl);
            setWasSubmitted( true );
            if ( autoClear === true ) setFormData( EmptyFormData );
            alert('Item created and image uploaded successfully!');
        } else {
            alert('Failed to upload the image.');
        }
    };

    const handleCategory23Click = (cat: number ,index: number, ): void => {
      setFormData(prevFormData => {
        const prevCategoryX = cat === 2 ? prevFormData.category2 : prevFormData.category3;

        const indexInArray = prevCategoryX.indexOf(index);
        let newCategoryX
        if (indexInArray > -1) {
          // Remove the index if it's already in the array
          newCategoryX = prevCategoryX.filter(i => i !== index);
        } else {
          // Add the index if it's not in the array
          newCategoryX = [...prevCategoryX, index];
        }

        const CategoryXs = cat === 2 ? Category2s : Category3s;
        // https://github.com/fps-solutions/FPS-Photo-Form/issues/6
        const clickedActual = PlaceHolderCategories.indexOf( CategoryXs[index] ) < 0 ? true : false;
        newCategoryX = newCategoryX.filter(function(idx) {
          return clickedActual ? PlaceHolderCategories.indexOf(CategoryXs[idx]) === -1 : PlaceHolderCategories.indexOf(CategoryXs[idx]) > -1;
        });
        const mashup = cat === 2 ? { category2: newCategoryX } : { category3: newCategoryX };
        return { ...prevFormData, ...mashup };
      });
    };

    const handleCategoryXClick = (cat: number ,index: number, ): void => {
      if ( cat === 1 ) {
        setFormData({ ...formData, category1: index })
      } else {
        handleCategory23Click( cat, index );
      }
    }

    const { title, x, y, z, category1, category2, category3 } = formData;
    const disableSubmit = wasSubmitted !== true && title && x !== null && y !== null && z !== null && typeof category1 === 'number' && category1 > -1 && category2.length > 0  && category3.length > 0 ? false : true;

    const numberFields = ['x', 'y', 'z'];

    return (
        <form className={ styles.fpsPhotoFormGrid }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={handleSubmit} onPaste={handleImagePaste as any}>

            { categoryButtons( 1, [ formData.category1 ], props, handleCategoryXClick ) }

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
                    style={{ width: '80%', paddingLeft: '.5em', marginLeft: '1em' }}
                  />
                </div>
              ))}
            </div>

            <div className={ styles.comments }style={{  }}>
                <label>Comments</label>
                <textarea value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })}
                    style={{ paddingLeft: '.5em', marginLeft: '1em', width: 'calc(100% - 2em)', height: '100px' }} />
            </div>

            { categoryButtons( 2, formData.category2, props, handleCategoryXClick ) }
            { categoryButtons( 3, formData.category3, props, handleCategoryXClick ) }

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
            {/* {imageData && (
              <div className={ styles.imagePreview }>
                  <h3>Pasted Image Preview:</h3>
                  <img src={imageData} alt="Pasted Image" style={{ maxWidth: '300px' }} />
              </div>
            )} */}

            <ImagePaste setParentImageData={ setImageData } imageBoxCSS={{ height: '200px', width: '300px' }} />

            <div className={ styles.spacer }/>

        </form>
    );
}

export default ScreenshotFormMash;