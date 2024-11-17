import * as React from 'react';
// import './ScatterChart.css';

import FadePanel from '@mikezimm/fps-library-v2/lib/components/molecules/FadePanel/component';
import { doesObjectExistInArray } from '@mikezimm/fps-core-v7/lib/logic/Arrays/searching/objectfind';
import FpsTileComponent from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FpsTileComponent';

import { useState, useEffect } from 'react';
import { IScatterChartProps, IScatterChartSize, IScatterSourceItem } from './IScatterChartProps';
import FPSSlider from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/Slider/component';
import SVGScatterHook from './SVG-Scatter-Hook';
import { IMinReactMouseEvent } from '@mikezimm/fps-core-v7/lib/types/react/IReactEvents';
import { IAnySourceItem, makeid } from '../../fpsReferences';

import './ScatterChart.module.css';
import FPSToggle from '@mikezimm/fps-library-v2/lib/components/atoms/Inputs/Toggle/component';
import { Icon } from '@fluentui/react/lib/Icon';

const gridGaps: number[] = [ 10, 50, 100, 250, 500, 1000, 2000 ];

function roundToNearestMultiple(current: number, roundTo: number): number {
  return Math.round(current / roundTo) * roundTo;
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

const ScatterChart: React.FC<IScatterChartProps> = ({
  show,
  hCenter,
  vCenter,
  chartDisplay,
  axisMap,
  stateSource,
  eleProps,
  eleExtras,
  filteredItems,
  filteredIds,
  refreshId,
  favorites,
}) => {

  const { diameter, displaySize, gridStep } = chartDisplay;
  const { centerLatest, } = chartDisplay;

  const [gridScale, setGridScale] = useState( gridGaps.indexOf( gridStep ) ? gridGaps.indexOf( gridStep ) : gridGaps.length -1 );  // Initial minY

  const maxRange: number = gridGaps[ gridScale ] * 10;

  const { tileHighlightColor } = eleExtras;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [highlightCSS, setHighlightCSS] = useState<React.CSSProperties>( tileHighlightColor ? { paddingLeft: '0.5em', color: tileHighlightColor, opacity: tileHighlightColor === 'yellow' ? .8 : 1 } : { paddingLeft: '0.5em', } ); // Initial centerX

  const [clickedIdx, setClickedIdx] = useState<number>( -1 ); // Initial centerX
  const [highlightIds, setHighlightIds] = useState<number[]>( [] ); // Initial centerX
  const [itemHistory, setItemHistory] = useState<IScatterSourceItem[]>( filteredItems ); // Initial centerX
  const [idHistory, setIdHistory] = useState<number[]>( filteredIds ); // Initial centerX
  const [historyRefresh, setHistoryRefresh ] = useState<string>( makeid(5) )
  const [chartHistory, setChartHistory] = useState<boolean>( false ); // Initial centerX

  const [centerX, setCenterX] = useState<number>( hCenter - (diameter / 2) ); // Initial centerX
  const [centerY, setCenterY] = useState<number>( vCenter - (diameter / 2) );  // Initial centerY

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

  // Update when stateSource is updated
  useEffect(() => {
    setItemHistory( filteredItems );
    setIdHistory( filteredIds );

    // Update grid scale down if there are filtered items found
    if ( filteredItems.length > 0 ) setGridScale( gridGaps.length > 3 ? 3 : gridScale );

    if ( !centerLatest ) return; // Do not recenter if feature is turned off
    const centerItem: IScatterSourceItem = filteredItems.length > 0 ? filteredItems[0] : stateSource.itemsY.length > 0 ? stateSource.itemsY[0] : null;
    if ( !centerItem ) return; // Do not move on or it will cause error
    setCenterX(centerItem.FPSItem.Scatter.horz);
    setCenterY(centerItem.FPSItem.Scatter.vert);

  }, [refreshId]);

  // Effect to update Y when Z changes
  useEffect(() => {
    // Update Y based on the new value of Z
    const roundTo: number = gridGaps[ gridScale ];
    setCenterX( Math.round(centerX / roundTo) * roundTo ); // Example: set Y to double the value of Z
    setCenterY( Math.round(centerY / roundTo) * roundTo ); // Example: set Y to double the value of Z

  }, [gridScale]); // Dependency array, effect runs when Z changes

  // const [step, setStep] = useState( roundToNearest( diameter / 10 ) );  // Initial centerY

  const useDisplaySize = displaySize ? displaySize : diameter / 75; // Default display size for circles

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

  const closePanel = (): void => {
    setClickedIdx( -1 );
  };

  const historyClick = (event: IMinReactMouseEvent, item: IAnySourceItem): void => {

    if ( event.shiftKey === true ) { // Remove item from history  https://github.com/fps-solutions/FPS-Photo-Form/issues/48
      setItemHistory( itemHistory.filter( itemX => itemX.Id !== item.Id ) ); // Remove the item from the history list
      setIdHistory( idHistory.filter( IdH => IdH !== item.Id ) );
      return;
    }

    const idx: boolean | string = doesObjectExistInArray( stateSource.items, 'Id', item.Id, false );
    setClickedIdx( idx === false ? -1 : parseInt( idx ) );
  }

  const onDotClick = ( Id: number, type: string, item: IScatterSourceItem, event: React.MouseEvent<SVGCircleElement, MouseEvent> ): void =>  {
    const newCenterX: number = item.FPSItem.Scatter.horz;
    const newCenterY: number = item.FPSItem.Scatter.vert;
    const currentIds: number[] = JSON.parse(JSON.stringify( highlightIds ));

    // setGridScale(3);
    if ( event.altKey === true && currentIds.indexOf( Id ) > -1 ) {
      // Remove selected item from highlights
      setHighlightIds( currentIds.filter( num => num !== Id ) );

    } else if ( event.altKey === true ) {
      // Add item to highlights
      setHighlightIds( [ ...highlightIds, Id ] );

    } else if ( event.ctrlKey === true ) {
      setHighlightIds( [ Id ] );
      setCenterX(newCenterX);
      setCenterY(newCenterY);

    } else {
      const idx: boolean | string = doesObjectExistInArray( stateSource.items, 'Id', Id, false );
      setHighlightIds( [ Id ] );
      setClickedIdx( idx === false ? -1 : parseInt( idx ) );
    }

    if ( event.altKey === true && currentIds.indexOf( Id ) > -1 ) {
      // Do not add to history if it was already added
    } else {
      setIdHistory( [ Id, ...idHistory ] );
      setItemHistory( [ item, ...itemHistory.filter( itemX => itemX.Id !== Id ) ] ); // Remove the item if it was further down in the pile... just keep latest
      setHistoryRefresh( makeid(5) );
    }
  };

  const handleHighlightHistory = (): void => {
    setHighlightIds( idHistory );
  };

  const handleClearHistory = (): void => {
    setIdHistory( [] );
    setItemHistory( [] );
    setChartHistory( false );
    setHistoryRefresh( makeid(5) );
  };

  const handleToggleHistory = (): void => {
    setChartHistory( chartHistory ? false : true );
  };

  const handleScaleScroll = (value: number): void => {
    setGridScale( value );
  };

  const handleHScroll = (value: number): void => {
    setCenterX( value - (diameter / 2) );
  };

  const handleVScroll = (value: number): void => {
    setCenterY( value - (diameter / 2) );
  };

  if ( show === false ) return null;

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

  const ScatterSize: IScatterChartSize = {
      horizontalMin: roundToNearestMultiple( centerX - maxRange/2, gridGaps[ gridScale ] ),
      horizontalMax: roundToNearestMultiple( centerX + maxRange/2, gridGaps[ gridScale ] ),
      verticalMin: roundToNearestMultiple( centerY - maxRange/2, gridGaps[ gridScale ] ),
      verticalMax: roundToNearestMultiple( centerY + maxRange/2, gridGaps[ gridScale ] ),
  }

  console.log(`Scatter Range H Grid:  C ${centerX} min ${ScatterSize.horizontalMin} to ${ScatterSize.horizontalMax}`);
  console.log(`Scatter Range V Grid:  C ${centerY} min ${ScatterSize.verticalMin} to ${ScatterSize.verticalMax}`);

  const sliderStyle: React.CSSProperties = { minWidth: '300px' };

  const brightSpan = ( str: string ): JSX.Element => {
    return  <span className='fade-bright' style={highlightCSS}>{ str }</span>
  };

  const favoriteButtons: JSX.Element[] = [];

  favorites.map( fav => {
    if ( fav.item ) {
      favoriteButtons.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <button onClick={(event) => onDotClick( fav.item.Id, 'DotClick', fav.item, event as any)}
          className='favButton' style={{ background: fav.Color }} title={ `CTRL-Click to recenter on location` }>
          { fav.Label ? <span>{ fav.Label }</span> : undefined }
          <Icon iconName={ fav.Icon } />
        </button>
      );
    }
  });

  const favoriteElement: JSX.Element = favoriteButtons.length === 0 ? undefined : <div style={{ display: 'flex', gap: '1em' }}>
    { favoriteButtons }
  </div>

  const clickedItem: IScatterSourceItem = clickedIdx < 0 ? undefined : stateSource.items[ clickedIdx ];
  const scatterItem = clickedIdx < 0 ? undefined : clickedItem.FPSItem.Scatter;
  const PanelContent: JSX.Element = clickedIdx < 0 ? undefined : <div className={ 'scatter-fade-panel' }>
    <div className='scatter-fade-panel-title'>{  brightSpan( clickedItem.FPSItem.Scatter.Title ) }</div>
    <div className='scatter-fade-details'>
      <div className='scatter-fade-panel-coords'>
        <div>Created: {  brightSpan(clickedItem.FPSItem.Stamp.createdNote) }</div>
        <div>Days ago: {  brightSpan( clickedItem.FPSItem.Stamp.created.age.toFixed(1) ) }</div>
        <div>Id: {  brightSpan( clickedItem.Id ) }</div>
      </div>
      <div className='scatter-fade-panel-coords'>
        <div>{ axisMap.horz }: { brightSpan(  `${scatterItem.horz}` ) }</div>
        <div>{ axisMap.vert }: { brightSpan(  `${scatterItem.vert}` ) }</div>
        <div>{ axisMap.depth }: { brightSpan(  `${scatterItem.depth}` ) }</div>
      </div>
      <div className='scatter-fade-panel-coords'>
        { scatterItem.Category1 ? <div>{ axisMap.Category1 }: { brightSpan(  scatterItem.Category1 ) }</div> : undefined }
        { scatterItem.Category2 && scatterItem.Category2.length > 0 ?  <div>{ axisMap.Category2 }: { brightSpan(   scatterItem.Category2 ? scatterItem.Category2.join(' | ') : 'none' ) }</div> : undefined }
        { scatterItem.Category2 && scatterItem.Category2.length > 0 ?  <div>{ axisMap.Category3 }: { brightSpan(   scatterItem.Category3 ? scatterItem.Category3 .join(' | ') : 'none' ) }</div> : undefined }
      </div>
      { scatterItem.Category2 && scatterItem.Category2.length > 0 ?  <div>
        <div style={{ fontSize: 'xx-large'}}>{ axisMap.Comments }:</div>
        <div style={{ fontSize: 'x-large'}}>{ brightSpan(  scatterItem.Comments ) }</div>
      </div> : undefined }
    </div>
    <img className='main-Image' src={ clickedItem.FPSItem.Image.src } style={{  }} />
  </div>;

  const disableClearHistory: boolean = itemHistory.length > 0 ? false : true;
  const disableHighlightHistory: boolean = idHistory.length > 0 ? false : true;
  // https://github.com/fps-solutions/FPS-Photo-Form/issues/45
  // https://github.com/fps-solutions/FPS-Photo-Form/issues/46
  const HistoryHeader: JSX.Element = <div className='history-header' style={{ color: disableClearHistory ? 'gray' : '' }}>
    <h3>Clicked History</h3>
    <FPSToggle
      containerStyle={ { paddingTop: '.25em' } }
      onOffTextStyle={ { width: '90px' } }
      label="Chart History"
      onText="Just history"
      offText="All items"
      forceChecked= { null }
      disabled= { false }
      onChange={ handleToggleHistory }
    />
    <div className='history-icon' style={{ cursor: disableHighlightHistory ? 'default' : 'pointer',  }} title='Highlight History' onClick={ handleHighlightHistory } >
      <span>Highlight</span>
      <Icon key='Input' iconName='Highlight' style={{  }}/>
    </div>
    <div className='history-icon' style={{ cursor: disableClearHistory ? 'default' : 'pointer',  }} title='Clear History' onClick={ handleClearHistory } >
      <span>Clear</span>
      <Icon key='Input' iconName='FormatPainter' style={{  }}/>
    </div>
    {/* <Icon key='Input' iconName='Delete' title='Clear History' onClick={ ( event ) => handleClearHistory } style={{ cursor: disableClearHistory ? 'default' : 'pointer', padding: '.5em', margin: '.5em', fontSize: 'x-large', fontWeight: 600 }}/> */}
  </div>

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

  return (
    // Not sure why but have to make this a little smaller here ;(
    <div style={{ width: '97%', }}>
      <div style={ { display: 'flex', gap: '2em' } }>
        <FPSSlider label={ axisMap.horz } initial={ hCenter } min={ hCenter - (diameter) } max={ hCenter + (diameter) } step={ gridGaps[ gridScale ] } onChange={ handleHScroll } style={ sliderStyle } />
        <FPSSlider label={ axisMap.vert } initial={ vCenter } min={ vCenter - (diameter) } max={ vCenter + (diameter) } step={ gridGaps[ gridScale ] } onChange={ handleVScroll } style={ sliderStyle } />
        <FPSSlider label={ 'Scale' } initial={ gridScale } min={ null } max={ null } step={ null } values={ gridGaps } onChange={ handleScaleScroll } style={ sliderStyle } />
        { favoriteElement }
      </div>

      { <FadePanel show={ PanelContent ? true : false } content={ PanelContent } refreshId={ `${clickedIdx}`} _hideBack={ closePanel } /> }

      <SVGScatterHook

        show={ show }
        axisMap={ axisMap }

        // const { diameter, gridStep, gridlineType, reverseVerticalAxis = false, displaySize, } = chartDisplay;
        chartDisplay={{  ...chartDisplay, ...{ displaySize: useDisplaySize, gridStep: gridGaps[ gridScale ] } }}
        stateSource={ !chartHistory ? stateSource : { ...stateSource, ...{ items: itemHistory, itemsY: itemHistory }} }
        highlightIds={ highlightIds }

        onDotClick={ onDotClick }
        onLineClick={ null }

        scatterSize={ScatterSize}
        // horizontalMin={ horizontalMin }
        // horizontalMax={ horizontalMax }
        // verticalMin={ verticalMin }
        // verticalMax={ verticalMax }

      />
      <FpsTileComponent
        reactStyles={ {} }
        componentClassName={ undefined }
        tilesClassName={ undefined }
        header={ HistoryHeader }
        // reactStyles={ { background: 'yellow' } }
        tiles={ itemHistory }
        refreshId={ historyRefresh }
        // Have to add eleProps in to get width because it is not on the item level but on the tiles component level via grid width
        eleProps= { eleProps }
        eleExtras={ eleExtras }
        overRideCallback={ historyClick }
      />
    </div>
  );
};

export default ScatterChart;
