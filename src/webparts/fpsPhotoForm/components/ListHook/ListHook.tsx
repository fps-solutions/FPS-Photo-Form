/**
 * CodeAnalizerComment: Updated 10 imports on 2024-09-22 17:16:57
 * Update:: import { makeid } to '@mikezimm/fps-core-v7/lib/logic/Strings/guids;'
 * Update:: import { ISourceProps } to '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps;'
 * Update:: import { StandardMetaViewProps } to '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps;'
 * Update:: import { getExpandColumns } to '@mikezimm/fps-core-v7/lib/components/molecules/source-props/Lists/getVX/getExpandV2;'
 * Update:: import { IAnySourceItem } to '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent;'
 * Update:: import { ISourceSearch } to '@mikezimm/fps-core-v7/lib/components/molecules/SearchPage/Interfaces/ISourceSearch;'
 * Update:: import { IStateSource } to '@mikezimm/fps-core-v7/lib/components/molecules/state-source/IStateSource;'
 * Update:: import { IPerformanceOp } to '@mikezimm/fps-core-v7/lib/components/molecules/Performance/IPerformance;'
 * Update:: import { addSearchMeta1 } to '@mikezimm/fps-core-v7/lib/components/molecules/SearchPage/functions/addSearchMeta1;'
 * Update:: import { CurrentTenant } to '@mikezimm/fps-core-v7/lib/components/molecules/source-props/IMinSourceFetchProps;'

 */

import * as React from 'react';
import { useState, } from 'react';

import { WebPartContext } from "@microsoft/sp-webpart-base";

import styles from './ListHook.module.scss';

import { PanelType } from '@fluentui/react/lib/Panel';

import { makeid } from '@mikezimm/fps-core-v7/lib/logic/Strings/guids';
import { ISourceButtonRowProps, sourceButtonRow } from '@mikezimm/fps-library-v2/lib/components/molecules/SourcePage/sourceButtonRow';
import Accordion from '@mikezimm/fps-library-v2/lib/components/molecules/Accordion/Accordion';
import SourcePages from '@mikezimm/fps-library-v2/lib/components/molecules/SourcePage/SourcePages';

import { ISourceProps, } from '@mikezimm/fps-core-v7/lib/components/molecules/source-props/ISourceProps';
import { IAnySourceItem } from '@mikezimm/fps-core-v7/lib/components/molecules/AnyContent/IAnyContent';

import { createExampleRow, } from './Row';
import { IStateSource } from '@mikezimm/fps-core-v7/lib/components/molecules/state-source/IStateSource';

import { CustomPanel } from '@mikezimm/fps-library-v2/lib/components/molecules/SourceList/Custom/CustomPanel';
import { IAxisMap, } from '../Forms/IScatterChartProps';

/***
 *     .o88b.  .d88b.  d8b   db .d8888. d888888b  .d8b.  d8b   db d888888b .d8888.
 *    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' d8' `8b 888o  88 `~~88~~' 88'  YP
 *    8P      88    88 88V8o 88 `8bo.      88    88ooo88 88V8o 88    88    `8bo.
 *    8b      88    88 88 V8o88   `Y8b.    88    88~~~88 88 V8o88    88      `Y8b.
 *    Y8b  d8 `8b  d8' 88  V888 db   8D    88    88   88 88  V888    88    db   8D
 *     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    YP   YP VP   V8P    YP    `8888Y'
 *
 *
 */

export type IPanelOption = 'performance' | 'item';  // Define what kinds of variants of the panel you want

export type ITopButtons = 'Mine' | 'OtherPeople' | 'ThisSite' | 'OtherSites';
export const TopButtons: ITopButtons[] = [ 'Mine', 'OtherPeople', 'ThisSite', 'OtherSites' ];

/***
 *    db   db  .d88b.   .d88b.  db   dD      d8888b. d8888b.  .d88b.  d8888b. .d8888.
 *    88   88 .8P  Y8. .8P  Y8. 88 ,8P'      88  `8D 88  `8D .8P  Y8. 88  `8D 88'  YP
 *    88ooo88 88    88 88    88 88,8P        88oodD' 88oobY' 88    88 88oodD' `8bo.
 *    88~~~88 88    88 88    88 88`8b        88~~~   88`8b   88    88 88~~~     `Y8b.
 *    88   88 `8b  d8' `8b  d8' 88 `88.      88      88 `88. `8b  d8' 88      db   8D
 *    YP   YP  `Y88P'   `Y88P'  YP   YD      88      88   YD  `Y88P'  88      `8888Y'
 *
 *
 */

export interface IListHookProps {
  context: WebPartContext;
  expandedState: boolean;  //Is this particular page expanded
  refreshId?: string; // optional in case needed
  stateSource: IStateSource;
  ListHookSourceProps: ISourceProps;
  axisMap: IAxisMap;
  refreshData: () => Promise<void>; // Type the method as a function that returns a Promise<void>  https://github.com/fps-solutions/FPS-Photo-Form/issues/83
}


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

const ListHook: React.FC<IListHookProps> = ( props ) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { context, expandedState, stateSource, ListHookSourceProps, axisMap, refreshData } = props;

  const CatButtons = [];
  CatButtons.push( axisMap.Category1 );
  CatButtons.push( axisMap.Category2 );
  CatButtons.push( axisMap.Category3 );
  // if ( axisMap.Category1 ) CatButtons.push( axisMap.Category1 );
  // if ( axisMap.Category2 ) CatButtons.push( axisMap.Category2 );
  // if ( axisMap.Category3 ) CatButtons.push( axisMap.Category3 );

  const [ topSearch, setTopSearch ] = useState<number | null>( 0 );

  const handleFetch = async () => {
    await refreshData();
    console.log('Items fetched!');
  }

  const multiSelectButtonRowProps: ISourceButtonRowProps = {
    title: '', // left Title string
    // heading?: JSX.Element; // Heading above row of buttons
    Labels: CatButtons,
    onClick: setTopSearch,
    selected: topSearch,
    // infoEle: INJSONIcons, // Floats to right of buttons
    // rowClass: null,
    selectedClass: styles.isSelected, // pass in background and color theme from SPFx
    rowCSS: { display: 'inline-flex', paddingTop: '0px' },
    // buttonCSS: null,
    // disabled: null, // Disabled button indexes or Labels, use 'all' to disable all buttons
    // descEle: null, // Added as block element below buttons.  strings are made to smaller font-size.
  }

  const MultiSelectEle: JSX.Element = sourceButtonRow( multiSelectButtonRowProps );

  /***
   *    db    db .d8888. d88888b      .d8888. d888888b  .d8b.  d888888b d88888b
   *    88    88 88'  YP 88'          88'  YP `~~88~~' d8' `8b `~~88~~' 88'
   *    88    88 `8bo.   88ooooo      `8bo.      88    88ooo88    88    88ooooo
   *    88    88   `Y8b. 88~~~~~        `Y8b.    88    88~~~88    88    88~~~~~
   *    88b  d88 db   8D 88.          db   8D    88    88   88    88    88.
   *    ~Y8888P' `8888Y' Y88888P      `8888Y'    YP    YP   YP    YP    Y88888P
   *
   *
   */

  const optionalColumns1: string[] = []; // Categories
  if ( axisMap.Category1 ) optionalColumns1.push( axisMap.Category1 );

  const optionalColumns3: string[] = []; // Categories
  if ( axisMap.Category2 ) optionalColumns3.push( axisMap.Category2 );
  if ( axisMap.Category3 ) optionalColumns3.push( axisMap.Category3 );

  const optionalColumns2: string[] = []; // Numbers
  if ( axisMap.horz ) optionalColumns2.push( axisMap.horz );
  if ( axisMap.vert ) optionalColumns2.push( axisMap.vert );
  if ( axisMap.depth ) optionalColumns2.push( axisMap.depth );

  const optionalColumns4: string[] = []; // Numbers
  if ( axisMap.Comments ) optionalColumns4.push( axisMap.Comments );
  if ( axisMap.Screenshot ) optionalColumns4.push( axisMap.Screenshot );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ refreshId, setRefreshId ] = useState<string>( makeid( 5 ) );
  const [ showPanel, setShowPanel ] = useState<boolean>( false );
  const [ panelItem, setPanelItem ] = useState<IAnySourceItem>( null );

  const exampleRowHeaders: string[] = [ 'Id', ...optionalColumns1,...optionalColumns2, 'Title', ...optionalColumns3, ...optionalColumns4, 'When', 'Who' ];


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

  /***
   *     .d88b.  d8b   db       .o88b. db      d888888b  .o88b. db   dD .d8888.
   *    .8P  Y8. 888o  88      d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 88'  YP
   *    88    88 88V8o 88      8P      88         88    8P      88,8P   `8bo.
   *    88    88 88 V8o88      8b      88         88    8b      88`8b     `Y8b.
   *    `8b  d8' 88  V888      Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. db   8D
   *     `Y88P'  VP   V8P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD `8888Y'
   *
   *
   */

  const setNewPanelItem = ( command: string, Id: number, type: IPanelOption, item: IAnySourceItem ): void => {
    if ( command === 'Filter' ) {
      // This option could be used to pre-filter the entire items in order to pass in smaller list to SourcePages
      // See Easy Analytics example.
    } else {
      setPanelItem( item );
      setShowPanel( true );
    }
  }


  /***
   *    d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b .d8888.
   *    88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 88'  YP
   *    88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    `8bo.
   *    88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88      `Y8b.
   *    88.     88booo. 88.     88  88  88 88.     88  V888    88    db   8D
   *    Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    `8888Y'
   *
   *
   */

  const AccordionContent: JSX.Element = <div className={ 'yourClassName' }style={{ cursor: 'default', padding: '5px 0px 5px 0px', display: 'flex', alignItems: 'center' }}>
    { MultiSelectEle }
    <button onClick={ handleFetch } className={ `button ${styles.enabled}` } style={{ marginLeft: '4em', marginRight: '2em' }}>Refresh</button>
    <div>Data refreshed as of { stateSource.unifiedPerformanceOps.fetch.startStr }</div>
  </div>;

  const accordionHeight: number = 85;

  const SourcePagesHeader: JSX.Element = <Accordion
    title = { `Expand for Category filters`}
    defaultIcon = 'Help'
    showAccordion = { true }
    content = { AccordionContent }
    refreshId={ makeid(5) }
    contentStylesVis = {{ height: `${accordionHeight}px` }}
  />;

  /***
   *    .d8888.  .d88b.  db    db d8888b.  .o88b. d88888b d8888b.  .d8b.   d888b  d88888b .d8888.
   *    88'  YP .8P  Y8. 88    88 88  `8D d8P  Y8 88'     88  `8D d8' `8b 88' Y8b 88'     88'  YP
   *    `8bo.   88    88 88    88 88oobY' 8P      88ooooo 88oodD' 88ooo88 88      88ooooo `8bo.
   *      `Y8b. 88    88 88    88 88`8b   8b      88~~~~~ 88~~~   88~~~88 88  ooo 88~~~~~   `Y8b.
   *    db   8D `8b  d8' 88b  d88 88 `88. Y8b  d8 88.     88      88   88 88. ~8~ 88.     db   8D
   *    `8888Y'  `Y88P'  ~Y8888P' 88   YD  `Y88P' Y88888P 88      YP   YP  Y888P  Y88888P `8888Y'
   *
   *
   */

  const itemsElement = <SourcePages
    // source={ SourceInfo }
    primarySource={ ListHookSourceProps }
    itemsPerPage={ 40 }
    pageWidth={ 1000 }
    topButtons={ stateSource[ `meta${topSearch}` as 'meta0']}

    stateSource={ stateSource }
    startQty={ 20 }
    showItemType={ false }
    debugMode={ null }

    tableHeaderElements={ exampleRowHeaders }
    tableClassName= { 'anyTableClass' }
    tableHeaderClassName= { [  ].join( ' ' )  }
    selectedClass={ styles.isSelected }

    optionalColumns1={ optionalColumns1 }
    optionalColumns2={ optionalColumns2 }
    optionalColumns3={ optionalColumns3 }
    optionalColumns4={ optionalColumns4 }
    renderRow={ createExampleRow }

    deepProps={ null }

    onParentCall={ setNewPanelItem }
    headingElement={ SourcePagesHeader }
    ageSlider={ false }
    searchAgeOp={ 'show <' }
    searchAgeProp={ 'Created' }
  />;

  /***
   *    d8888b.  .d8b.  d8b   db d88888b db
   *    88  `8D d8' `8b 888o  88 88'     88
   *    88oodD' 88ooo88 88V8o 88 88ooooo 88
   *    88~~~   88~~~88 88 V8o88 88~~~~~ 88
   *    88      88   88 88  V888 88.     88booo.
   *    88      YP   YP VP   V8P Y88888P Y88888P
   *
   *
   */

  const panelContent : JSX.Element = showPanel !== true ? undefined : CustomPanel({
    source: null,
    primarySource: ListHookSourceProps,
    item: panelItem,
    onClosePanel: () => { setShowPanel( false ) },

    showItemPanel: showPanel,
    search: null,
    searchText: '',
    refreshId: refreshId,
    showCanvasContent1: false,
    showProperties: true,
    reactPanelType: PanelType.medium,
    showHeading: true,
    // customElement1: createPerformanceTableVisitor( panelJSON, [] ) ,
    // customElement1B: FPSPropsJSON,

  });

  /***
   *    d88888b d888888b d8b   db  .d8b.  db           d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b
   *    88'       `88'   888o  88 d8' `8b 88           88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~'
   *    88ooo      88    88V8o 88 88ooo88 88           88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88
   *    88~~~      88    88 V8o88 88~~~88 88           88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88
   *    88        .88.   88  V888 88   88 88booo.      88.     88booo. 88.     88  88  88 88.     88  V888    88
   *    YP      Y888888P VP   V8P YP   YP Y88888P      Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP
   *
   *
   */

  const FinalElement: JSX.Element = <div className = { [].join( ' ' ) } style={{ minHeight: '450px' }}>
    { itemsElement }
    { panelContent }
  </div>;

  return ( FinalElement );

}

export default ListHook;