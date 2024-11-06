/**
 * CodeAnalizerComment: Updated 1 imports on 2024-09-22 17:16:57
 * Update:: import { IAnySourceItem } to '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent;'

 */

/* eslint-disable dot-notation */

import * as React from 'react';

import { getHighlightedText } from '@mikezimm/fps-library-v2/lib/components/atoms/Elements/HighlightedText';

import { ISourceRowRender } from '@mikezimm/fps-library-v2/lib/components/molecules/SourcePage/ISourceRowRender';

import styles from './RowStyles.module.scss';
import { IAnySourceItem } from '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent';
import { GetFirstWord } from '@mikezimm/fps-core-v7/lib/logic/Strings/drillParse/getWords';
import { IScatterSourceItem } from '../Forms/IScatterChartProps';

require ('@mikezimm/fps-styles/dist/fpsGeneralCSS.css');
const noWrap = `fps-gen-text-ellipse`; // From fps-stiles fpsGeneralCSS.css

export interface IExampleHookRead extends IAnySourceItem {

}

export function createExampleRow( props: ISourceRowRender ): JSX.Element { // eslint-disable-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { item, onClick, searchText, onParentCall, optionalColumns1, optionalColumns2, optionalColumns3, optionalColumns4 } = props; // details, showItemType, onOpenPanel

  const thisItem: IScatterSourceItem = item as IScatterSourceItem;

  const { Title, Id, Created, Author, } = thisItem; // , BannerImageUrl, PromotedState

  const created = thisItem?.FPSItem?.Stamp?.created;
  const CreateDate = created ? created.dayYYYYMMDD : '';
  const CreateAge = created ? created.age.toFixed( 1 ) : '';


  const Num1 = !optionalColumns2[0] ? '' : thisItem[ optionalColumns2[0] as keyof IAnySourceItem ];
  const Num2 = !optionalColumns2[1] ? '' : thisItem[ optionalColumns2[1] as keyof IAnySourceItem ];
  const Num3 = !optionalColumns2[2] ? '' : thisItem[ optionalColumns2[2] as keyof IAnySourceItem ];

  const Category1 = !optionalColumns1[0] ? '' : thisItem[ optionalColumns1[0] as keyof IAnySourceItem ];

  const Category2 = !optionalColumns3[0] ? '' : thisItem[ optionalColumns3[0] as keyof IAnySourceItem ];
  const Category3 = !optionalColumns3[1] ? '' : thisItem[ optionalColumns3[1] as  keyof IAnySourceItem ];

  const Comments = !optionalColumns4[0] ? '' : thisItem[ optionalColumns4[0] as  keyof IAnySourceItem ];
  const Screenshot = !optionalColumns4[1] ? '' : thisItem[ optionalColumns4[1] as  keyof IAnySourceItem ];

  const row = <tr className={ styles.requestsRow } onClick = { (event) => onClick( Id, 'generic', item, event ) }>

    <td title={ null } onClick= { () => props.onParentCall( 'Item', item.Id, '', item ) }  >{ Id }</td>

    <td className = { noWrap } title={ '' } style={{ maxWidth: '100px' }}>{ !Category1 ? '' : getHighlightedText( Category1, searchText ) }</td>

    { !optionalColumns2[0] ? undefined :<td className = { noWrap } title={ optionalColumns2[0] } >{ Num1 }</td> }
    { !optionalColumns2[1] ? undefined :<td className = { noWrap } title={ optionalColumns2[1] } >{ Num2 }</td> }
    { !optionalColumns2[2] ? undefined :<td className = { noWrap } title={ optionalColumns2[2] } >{ Num3 }</td> }

    <td className = { noWrap } title={ Title } >{ getHighlightedText( Title, searchText ) }</td>

    { !optionalColumns3[0] ? undefined :<td className = { '' } title={ optionalColumns3[0] } >{ !Category2 ? '' : getHighlightedText( Category2.join( ' | '), searchText ) }</td> }
    { !optionalColumns3[1] ? undefined :<td className = { '' } title={ optionalColumns3[1] } >{ !Category3 ? '' : getHighlightedText( Category3.join( ' | '), searchText ) }</td> }

    { !optionalColumns4[0] ? undefined :<td className = { '' } title={ Comments } >{ getHighlightedText( Comments, searchText ) }</td> }
    { !optionalColumns4[1] ? undefined :<td className = { `${noWrap} ${ styles.hoverImage }` } title={ Screenshot } style={{  }}><img src={ Screenshot }/></td> }

    <td className = { noWrap } title={ Created } >{ CreateDate } <b>-{ CreateAge } days</b></td>
    <td className = { noWrap } title={ Author.Title } >{ getHighlightedText( GetFirstWord( Author.Title, false, false, false ), searchText ) }</td>

  </tr>;

  return row;

}


