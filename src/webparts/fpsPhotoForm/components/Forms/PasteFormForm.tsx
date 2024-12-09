import * as React from 'react';
import { useState, FormEvent, useEffect, } from 'react';
import { getThisFPSDigestValueFromUrl } from '@mikezimm/fps-core-v7/lib/components/molecules/SpHttp/digestValues/fromUrl/getThisFPSDigestValueFromUrl';

import { ISourceProps } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';

import styles from '../FpsPhotoForm.module.scss';
import FPSToggle from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/Toggle/component';
import { IPhotoButtonStyle } from '../Scatter/IScatterChartProps';
import { base64ToBlob, } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/ClipboardImage/ImageSave';
import { categoryButtons } from './PasteFormPieces';
import { handleImagePaste } from '@mikezimm/fps-core-v7/lib/components/atoms/Inputs/ClipboardImage/handlePasteImage';
import { makeid } from '../../fpsReferences';

// import ImagePaste from './Camera/ClipboardImage/fps-ImagePaste';
import ImagePaste from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/ClipboardImage/fps-ImagePaste';

// import { postSourceFilesAPI } from './FileDropBox/functions/postSourceFilesAPI';
import { postSourceFilesAPI } from '@mikezimm/fps-core-v7/lib/restAPIs/lists/files/postSourceFilesAPI';
import { IFileDropBoxProps } from './FileDropBox/IFileDropBoxProps';  // Import the FileDropBox component
import FileUploadContainer from './FileDropBox/fps-FileDropContainer';
import { DefaultFormTabsProduction, IDefaultFormTab, IPrefabFormTemplates } from '../IFpsPhotoFormProps';
import { buildPhotoFormFileName } from "./FileDropBox/buildPhotoFormFileName";
import { extractImageLocationData, IImageLocationData } from './FileDropBox/functions/getImageLocation';
import { FPSReactJSON } from '@mikezimm/fps-library-v2/lib/components/atoms/ReactJSON/ReactJSONObject';

export interface IMiscFormWPProps {
  // https://github.com/fps-solutions/FPS-Photo-Form/issues/24
  imageSubfolder2: string;
  prefabForm: IPrefabFormTemplates;
  enableExperimental: boolean;
  forceFormTemplate: boolean;
  photoButtonStyles: string;

  category1s: string;
  category2s: string;
  category3s: string;

  // https://github.com/fps-solutions/FPS-Photo-Form/issues/108
  maxFetchCount: string;

  defaultTab: IDefaultFormTab;
}

export function buildMiscFormFromWPProps( wpProps: IMiscFormWPProps ): IMiscFormProps {

  const { imageSubfolder2, prefabForm, enableExperimental, forceFormTemplate, photoButtonStyles, defaultTab } = wpProps;
  let photoButtonStylesObj: IPhotoButtonStyle[] = [];
  try {
    photoButtonStylesObj = JSON.parse( photoButtonStyles );

  } catch(e) {
    console.log( `Unable to parse buttonStyles `);

  }

  // https://github.com/fps-solutions/FPS-Photo-Form/issues/100
  const useDefaultTab:  IDefaultFormTab = enableExperimental === true || DefaultFormTabsProduction.indexOf( defaultTab ) > -1 ? defaultTab : 'Input';

  const MiscProps: IMiscFormProps = {
    imageSubfolder2: imageSubfolder2,
    prefabForm: prefabForm,
    enableExperimental: enableExperimental,
    forceFormTemplate: forceFormTemplate,
    photoButtonStyles: photoButtonStylesObj,

    defaultTab: useDefaultTab,
  }

  return MiscProps;

}

export const changesInputForm: ( keyof IMiscFormWPProps )[] = [ 'photoButtonStyles', 'defaultTab', 'imageSubfolder2', 'prefabForm', 'enableExperimental', 'forceFormTemplate' ];

export interface IMiscFormProps {
  // https://github.com/fps-solutions/FPS-Photo-Form/issues/24
  imageSubfolder2: string;
  prefabForm: IPrefabFormTemplates;
  enableExperimental: boolean;
  forceFormTemplate: boolean;
  photoButtonStyles: IPhotoButtonStyle[];

  defaultTab: IDefaultFormTab;
}

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
  fileDropBoxProps: IFileDropBoxProps;
  ListSource: ISourceProps;
  ImagesSource: ISourceProps;

  miscFormProps: IMiscFormProps;


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

/***
 *    .d8888. d888888b  .d8b.  d8888b. d888888b      db   db  .d88b.   .d88b.  db   dD
 *    88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~'      88   88 .8P  Y8. .8P  Y8. 88 ,8P'
 *    `8bo.      88    88ooo88 88oobY'    88         88ooo88 88    88 88    88 88,8P
 *      `Y8b.    88    88~~~88 88`8b      88         88~~~88 88    88 88    88 88`8b
 *    db   8D    88    88   88 88 `88.    88         88   88 `8b  d8' `8b  d8' 88 `88.
 *    `8888Y'    YP    YP   YP 88   YD    YP         YP   YP  `Y88P'   `Y88P'  YP   YD
 *
 *
 */

const PhotoFormInput: React.FC<IPhotoFormInput> = ( props ) => {
  const { display, ListSource, ImagesSource, Category1s, Category2s, Category3s, fileDropBoxProps } = props; // ListSiteUrl, ListTitle, LibrarySiteUrl, LibraryName,

    const [imageData, setImageData] = useState<string | null>(null);
    const [imageBlob, setImageBlob] = useState<File | null>(null);
    const [imageInfo, setImageInfo] = useState<IImageLocationData | null>(null); // State to hold captured image - https://github.com/fps-solutions/FPS-Photo-Form/issues/105

    const [imageRefresh, setImageRefresh] = useState<string | null>(null);
    const [formData, setFormData] = useState<IPhotoFormFormInterface>( EmptyFormData );
    const [fileMode, setFileMode ] = useState< 'DropBox' | 'Paste' >( props.fileDropBoxProps.useDropBox === true ? 'DropBox' : 'Paste' );
    const [autoClear, setAutoClear ] = useState<boolean>( true );
    const [resetId, setResetId ] = useState<string>( props.fileDropBoxProps.resetId );

    const [wasSubmitted, setWasSubmitted ] = useState<boolean>(false);

  /***
   *    db    db .d8888. d88888b      d88888b d88888b d88888b d88888b  .o88b. d888888b
   *    88    88 88'  YP 88'          88'     88'     88'     88'     d8P  Y8 `~~88~~'
   *    88    88 `8bo.   88ooooo      88ooooo 88ooo   88ooo   88ooooo 8P         88
   *    88    88   `Y8b. 88~~~~~      88~~~~~ 88~~~   88~~~   88~~~~~ 8b         88
   *    88b  d88 db   8D 88.          88.     88      88      88.     Y8b  d8    88
   *    ~Y8888P' `8888Y' Y88888P      Y88888P YP      YP      Y88888P  `Y88P'    YP
   *
   *
   */

    // Update wasSubmitted to false whenever formData changes
    useEffect(() => {
      setWasSubmitted(false);
    }, [formData]);

/***
 *    db   db  .d8b.  d8b   db d8888b. db      d88888b       .o88b. db      d888888b  .o88b. db   dD .d8888.
 *    88   88 d8' `8b 888o  88 88  `8D 88      88'          d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 88'  YP
 *    88ooo88 88ooo88 88V8o 88 88   88 88      88ooooo      8P      88         88    8P      88,8P   `8bo.
 *    88~~~88 88~~~88 88 V8o88 88   88 88      88~~~~~      8b      88         88    8b      88`8b     `Y8b.
 *    88   88 88   88 88  V888 88  .8D 88booo. 88.          Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. db   8D
 *    YP   YP YP   YP VP   V8P Y8888D' Y88888P Y88888P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD `8888Y'
 *
 *
 */

    const handleToggleChange = (checked: boolean): void => {
      setAutoClear(checked); // Update the state when toggle changes
    };

    const handleFileToggle = (checked: boolean): void => {
      setFileMode( checked === true ? 'DropBox' : 'Paste' ); // Update the state when toggle changes
    };

    const handleImagePaste = async ( dataString: string ): Promise<void> => {
      if (dataString !== imageData) {
        setImageData( dataString );
        // https://github.com/fps-solutions/FPS-Photo-Form/issues/105
        const newImageInfo: IImageLocationData = await extractImageLocationData( dataString )
        setImageInfo( newImageInfo );
      }
    }

    const handleDropBoxFile = async (updatedFiles: File[]): Promise<void> => {
      const tempBlob = updatedFiles && updatedFiles.length > 0 ? updatedFiles[0] : null;
      setImageBlob( tempBlob );
      // https://github.com/fps-solutions/FPS-Photo-Form/issues/105
      const newImageInfo: IImageLocationData = await extractImageLocationData( tempBlob )
      setImageInfo( newImageInfo );
    }

    const resetForm = (): void => {
      setFormData( EmptyFormData );
      setImageData( null );
      setImageBlob( null );
      setImageInfo( null );
      setImageRefresh( makeid(5));
      setResetId( makeid(5));
    }

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
                    // In your example, the If-Match: '*' simplifies the update process by ignoring ETag/versioning checks.
                    // This is efficient but could lead to unintended overwrites if the list item is being concurrently modified
                    // by other processes or users. If version control is critical in your application, you might want to fetch
                    // and use the item's current ETag instead.
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
        if (!formData.title || ( fileMode === 'Paste' && !imageData ) || ( fileMode === 'DropBox' && !imageBlob )) {
            alert('Please provide a title and paste/upload an image');
            return;
        }

        const listItemResponse = await createListItem(formData.title);
        // const fileDesc = [ `${ Category1s[formData.category1 ]}` ];
        // fileDesc.push( `X${formData.x}_Y${formData.y}_Z${formData.z}` );
        // formData.category2.map( idx => { if ( formData.title.indexOf( Category2s[ idx ] ) < 0 ) fileDesc.push( Category2s[ idx ] ); });
        // formData.category3.map( idx => { if ( formData.title.indexOf( Category3s[ idx ] ) < 0 ) fileDesc.push( Category3s[ idx ] ); });
        // fileDesc.push( `${formData.title}` );
        // {{Today}}_{{Category1}}_{{Category2}}_{{Category3}}_{{Comments}}_X{{Number1}}_Y{{Number2}}_Z{{Number3}}_{{Title}}

        const shortFileName = buildPhotoFormFileName( formData, props, imageBlob ? imageBlob.name: '', fileDropBoxProps.fileNameHandleBars );

        const blob = fileMode === 'DropBox' ? imageBlob : base64ToBlob(imageData);

        const requestDigest = await getThisFPSDigestValueFromUrl(ImagesSource.absoluteWebUrl as '');
        const fileReturn = await postSourceFilesAPI( { ...ImagesSource, ...{ digestValue: requestDigest } }, true, blob, shortFileName, true, true );

        if (fileReturn.itemUrl ) {
            await updateListItemWithImage(listItemResponse.Id, fileReturn.itemUrl);
            setWasSubmitted( true );
            if ( autoClear === true ) setFormData( EmptyFormData );
            if ( autoClear === true ) setImageRefresh( makeid(5));
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

    const shortFileName = buildPhotoFormFileName( formData, props, imageBlob ? imageBlob.name: '', fileDropBoxProps.fileNameHandleBars );

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
              <button className={ styles.clearButton }type="reset" onClick={ () => resetForm( )}>Reset</button>

              {/* <FPSToggle
                label="Reset on Create"
                onText="Auto"
                offText="Manual"
                onChange={ handleToggleChange }
              /> */}

              <FPSToggle
                forceChecked={ fileMode === 'DropBox' ? true : false }
                label="Image Mode"
                onText="Dropbox"
                offText="Paste"
                onChange={ handleFileToggle }
              />

              {/* <div>Current Toggle State: { `${autoClear}` }</div> */}
              <label style={{ }}>FileName to create:</label>
              <div>{ `${shortFileName}` }</div>

            </div>
            {/* {imageData && (
              <div className={ styles.imagePreview }>
                  <h3>Pasted Image Preview:</h3>
                  <img src={imageData} alt="Pasted Image" style={{ maxWidth: '300px' }} />
              </div>
            )} */}

            { fileMode === 'Paste' ? <ImagePaste clearId= { imageRefresh } setParentImageData={ handleImagePaste } imageBoxCSS={{ height: '200px', width: '300px' }} /> : undefined }
            {/* <ParentComponent
              FilesSource={ props.ImagesSource }
              fileDropBoxProps={ props. fileDropBoxProps }
            /> */}
            <FileUploadContainer
              useDropBox={ fileMode === 'Paste' ? false : true }
              fileTypes={ props.fileDropBoxProps.fileTypes }  // Accept only PNG and JPEG files
              setParentFilesData={handleDropBoxFile}  // Callback to receive file updates
              maxUploadCount={ 1 }
              fileMaxSize={ props.fileDropBoxProps.fileMaxSize }
              fileWarnSize={ props.fileDropBoxProps.fileWarnSize }
              fileNameHandleBars={ props.fileDropBoxProps.fileNameHandleBars }
              refreshId={ props.fileDropBoxProps.refreshId }
              resetId={ resetId }
            />
            <div className={ styles.spacer } style={{ height: fileMode === 'DropBox' ? '0px' : null }}/>
            <div className={ styles.json } >
              {/* https://github.com/fps-solutions/FPS-Photo-Form/issues/105 */}
              <FPSReactJSON jsonObject={ imageInfo } name='ImageExIf' />
            </div>

        </form>
    );
}

export default PhotoFormInput;