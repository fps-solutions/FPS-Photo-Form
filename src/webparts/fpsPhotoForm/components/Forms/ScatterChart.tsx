import * as React from 'react';
// import './ScatterChart.css';

import FadePanel from '@mikezimm/fps-library-v2/lib/components/molecules/FadePanel/component';
import { doesObjectExistInArray } from '@mikezimm/fps-core-v7/lib/logic/Arrays/searching/objectfind';

import { useState, useEffect } from 'react';
import { IScatterChartProps, IScatterSourceItem } from './IScatterChartProps';
import FPSSlider from '../Slider/component';
import SVGScatterHook from './SVG-Scatter-Hook';
import { IMinReactMouseEvent } from '@mikezimm/fps-core-v7/lib/types/react/IReactEvents';

const gridGaps: number[] = [ 10, 50, 100, 250, 500, 1000, 2000 ];

const roundToNearest = (num: number ): number => Math.round(num / Math.pow(10, Math.floor(Math.log10(num)))) * Math.pow(10, Math.floor(Math.log10(num)));

const ScatterChart: React.FC<IScatterChartProps> = ({
  show,
  hCenter,
  vCenter,
  chartDisplay,
  axisMap,
  stateSource,
}) => {

  const { diameter, gridStep, reverseVerticalAxis = false, displaySize, } = chartDisplay;

  const [gridScale, setGridScale] = useState( gridGaps.length -1 );  // Initial minY

  const maxRange: number = gridGaps[ gridScale ] * 10;

  const [clickedIdx, setClickedIdx] = useState( -1 ); // Initial centerX
  const [highlightIds, setHighlightIds] = useState( [] ); // Initial centerX
  const [idHistory, setIdHistory] = useState( [] ); // Initial centerX
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
    setClickedIdx( item.Id )
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
      setIdHistory( [ Id, ...idHistory ] );
      item.FPSItem.Link.callbackClick = historyClick; // Adding the callback here
      setItemHistory( [ item, ...itemHistory ] );
      setCenterX(newCenterX);
      setCenterY(newCenterY);

    } else {
      const idx: any = doesObjectExistInArray( stateSource.items, 'Id', Id, false );
      setHighlightIds( [ Id ] );
      setIdHistory( [ Id, ...idHistory ] );
      item.FPSItem.Link.callbackClick = historyClick; // Adding the callback here
      setItemHistory( [ item, ...itemHistory ] );
      setClickedIdx( idx === false ? -1 : parseInt( idx ) );
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

  const PanelContent: JSX.Element = clickedIdx < 0 ? undefined : <div>
    <img src={ stateSource.items[ clickedIdx ].FPSItem.Image.src } style={{ maxWidth: '100%' }} />
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

    </div>
  );
};

export default ScatterChart;
