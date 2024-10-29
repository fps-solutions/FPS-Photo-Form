import * as React from 'react';
// import './ScatterChart.css';

import FadePanel from '@mikezimm/fps-library-v2/lib/components/molecules/FadePanel/component';
import { doesObjectExistInArray } from '@mikezimm/fps-core-v7/lib/logic/Arrays/searching/objectfind';
import FpsTileComponent from '@mikezimm/fps-library-v2/lib/components/molecules/FPSTiles/components/FpsTileComponent';

import { useState, useEffect } from 'react';
import { IScatterChartProps, IScatterSourceItem } from './IScatterChartProps';
import FPSSlider from '../Slider/component';
import SVGScatterHook from './SVG-Scatter-Hook';
import { IMinReactMouseEvent } from '@mikezimm/fps-core-v7/lib/types/react/IReactEvents';
import { makeid } from '../../fpsReferences';

import './ScatterChart.module.css';

const gridGaps: number[] = [ 10, 50, 100, 250, 500, 1000, 2000 ];

function roundToNearestMultiple(current: number, roundTo: number): number {
  return Math.round(current / roundTo) * roundTo;
}

const ScatterChart: React.FC<IScatterChartProps> = ({
  show,
  hCenter,
  vCenter,
  chartDisplay,
  axisMap,
  stateSource,
  eleProps,
  eleExtras
}) => {

  const { diameter, gridStep, reverseVerticalAxis = false, displaySize, } = chartDisplay;

  const [gridScale, setGridScale] = useState( gridGaps.length -1 );  // Initial minY

  const maxRange: number = gridGaps[ gridScale ] * 10;

  const { tileHighlightColor } = eleExtras;

  const [highlightCSS, setHighlightCSS] = useState( tileHighlightColor ? { paddingLeft: '0.5em', color: tileHighlightColor, opacity: tileHighlightColor === 'yellow' ? .8 : 1 } : { paddingLeft: '0.5em', } ); // Initial centerX


  const [clickedIdx, setClickedIdx] = useState( -1 ); // Initial centerX
  const [highlightIds, setHighlightIds] = useState( [] ); // Initial centerX
  const [idHistory, setIdHistory] = useState( [] ); // Initial centerX
  const [historyRefresh, setHistoryRefresh ] = useState( makeid(5) )
  const [itemHistory, setItemHistory] = useState( [] ); // Initial centerX

  const [centerX, setCenterX] = useState( hCenter - (diameter / 2) ); // Initial centerX
  const [centerY, setCenterY] = useState( vCenter - (diameter / 2) );  // Initial centerY

  // Effect to update Y when Z changes
  useEffect(() => {
    // Update Y based on the new value of Z
    const roundTo: number = gridGaps[ gridScale ];
    setCenterX( Math.round(centerX / roundTo) * roundTo ); // Example: set Y to double the value of Z
    setCenterY( Math.round(centerY / roundTo) * roundTo ); // Example: set Y to double the value of Z

  }, [gridScale]); // Dependency array, effect runs when Z changes

  // const [step, setStep] = useState( roundToNearest( diameter / 10 ) );  // Initial centerY

  const useDisplaySize = displaySize ? displaySize : diameter / 75; // Default display size for circles

  const closePanel = (): void => {
    setClickedIdx( -1 );
  };

  const historyClick = (event: IMinReactMouseEvent, item: IScatterSourceItem): void => {
    const idx: any = doesObjectExistInArray( stateSource.items, 'Id', item.Id, false );
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
      const idx: any = doesObjectExistInArray( stateSource.items, 'Id', Id, false );
      setHighlightIds( [ Id ] );
      setClickedIdx( idx === false ? -1 : parseInt( idx ) );
    }

    if ( event.altKey === true && currentIds.indexOf( Id ) > -1 ) {
      // Do not add to history if it was already added
    } else {
      setIdHistory( [ Id, ...idHistory ] );
      item.FPSItem.Link.callbackClick = historyClick; // Adding the callback here
      setItemHistory( [ item, ...itemHistory.filter( item => item.Id !== Id ) ] ); // Remove the item if it was further down in the pile... just keep latest
      setHistoryRefresh( makeid(5) );
    }
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

  const horizontalMin = centerX - maxRange/2;
  const horizontalMax = centerX + maxRange/2;
  const verticalMin = centerY - maxRange/2;
  const verticalMax = centerY + maxRange/2;

  console.log(`Scatter Range H Grid:  C ${centerX} min ${horizontalMin} to ${horizontalMax}`);
  console.log(`Scatter Range V Grid:  C ${centerY} min ${verticalMin} to ${verticalMax}`);

  const sliderStyle: React.CSSProperties = { minWidth: '300px' };

  const brightSpan = ( str: string ): JSX.Element => {
    return  <span className='fade-bright' style={highlightCSS}>{ str }</span>
  };


  const clickedItem: IScatterSourceItem = clickedIdx < 0 ? undefined : stateSource.items[ clickedIdx ];
  const scatterItem = clickedIdx < 0 ? undefined : clickedItem.FPSItem.Scatter;
  const PanelContent: JSX.Element = clickedIdx < 0 ? undefined : <div className={ 'scatter-fade-panel' }>
    <div className='scatter-fade-panel-title'>{  brightSpan( clickedItem.FPSItem.Scatter.Title ) }</div>
    <div className='scatter-fade-details'>
      <div className='scatter-fade-panel-coords'>
        <div>Created: {  brightSpan(clickedItem.FPSItem.Stamp.createdNote) }</div>
        <div>Days ago: {  brightSpan( clickedItem.FPSItem.Stamp.created.age.toFixed(1) ) }</div>
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

  return (
    // Not sure why but have to make this a little smaller here ;(
    <div style={{ width: '97%', }}>
      <div style={ { display: 'flex', gap: '2em' } }>
        <FPSSlider label={ axisMap.horz } initial={ centerX } min={ hCenter - (diameter) } max={ hCenter + (diameter) } step={ gridGaps[ gridScale ] } onChange={ handleHScroll } style={ sliderStyle } />
        <FPSSlider label={ axisMap.vert } initial={ centerY } min={ vCenter - (diameter) } max={ vCenter + (diameter) } step={ gridGaps[ gridScale ] } onChange={ handleVScroll } style={ sliderStyle } />
        <FPSSlider label={ 'Scale' } initial={ gridScale } min={ null } max={ null } step={ null } values={ gridGaps } onChange={ handleScaleScroll } style={ sliderStyle } />
      </div>

      { <FadePanel show={ PanelContent ? true : false } content={ PanelContent } refreshId={ `${clickedIdx}`} _hideBack={ closePanel } /> }

      <SVGScatterHook

        show={ show }
        axisMap={ axisMap }

        // const { diameter, gridStep, gridlineType, reverseVerticalAxis = false, displaySize, } = chartDisplay;
        chartDisplay={{  ...chartDisplay, ...{ displaySize: useDisplaySize, gridStep: gridGaps[ gridScale ] } }}
        stateSource={ stateSource }
        highlightIds={ highlightIds }

        onDotClick={ onDotClick }
        onLineClick={ null }

        horizontalMin={ horizontalMin }
        horizontalMax={ horizontalMax }
        verticalMin={ verticalMin }
        verticalMax={ verticalMax }

      />
      <FpsTileComponent
        reactStyles={ {} }
        componentClassName={ undefined }
        tilesClassName={ undefined }
        header={ <h3>Clicked History</h3>         }
        // reactStyles={ { background: 'yellow' } }
        tiles={ itemHistory }
        refreshId={ historyRefresh }
        // Have to add eleProps in to get width because it is not on the item level but on the tiles component level via grid width
        eleProps= { eleProps }
        eleExtras={ eleExtras }
      />
    </div>
  );
};

export default ScatterChart;
