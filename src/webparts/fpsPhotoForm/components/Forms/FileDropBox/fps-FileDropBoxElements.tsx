import * as React from 'react';
import { getMIMEObjectPropFromType, IMIMEType_Specific } from './fps-FileDropTypes';
import { getSizeLabel } from '@mikezimm/fps-core-v7/lib/logic/Math/labels';

export interface IFileClickElement {
  handleClickFile: (file: File, index: number) => void;
  iconChar: string;
  iconStyles?: React.CSSProperties;
}

export function createFileElementList( files: File[], fileMaxSize: number, fileClick: IFileClickElement, ordered: boolean, returnMessage: boolean = true ): JSX.Element {
  const { handleClickFile = null, iconChar = null, iconStyles = {} } = fileClick || {};

  if ( !files || files.length === 0 ) return returnMessage ? <div>No files selected</div> : undefined;

  const rows: JSX.Element[] = files.map((file, index) => (
    <li key={index}>{ !handleClickFile ? undefined :
        <button
          onClick={ !handleClickFile ? null : ( ) => { handleClickFile( file, index ) } }
          disabled={ false }
          style={ { ...{
            // position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            borderRadius: '20%',
            width: '1.5em',
            height: '1.5em',
            fontSize: '14px',
            color: '#333',
            cursor: 'pointer',
            margin: '.25em',
            zIndex: 10,
            padding: '0px', // Added this when using trash icon
          }, ...iconStyles }}
          title={ `CLEAR ${ file.name }` }
        >{ iconChar }
        </button> }
        {file.name} - [&nbsp;
          { getMIMEObjectPropFromType( file.type as IMIMEType_Specific, 'name', 'fileType' ) }&nbsp;
          { file.size > fileMaxSize ? <span style={{ color: 'red', fontWeight: 600 }}>&nbsp;{ getSizeLabel( file.size ) }&nbsp;</span> : '' }]
    </li>
  ))

  const ele: JSX.Element = ordered === true ? <ol>{rows}</ol> : <ul>{rows}</ul>;

  return ele;
}
