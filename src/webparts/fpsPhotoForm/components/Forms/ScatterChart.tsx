import * as React from 'react';
// import './ScatterChart.css';

import { useState, useEffect } from 'react';
import { IScatterChartProps } from './IScatterChartProps';
import FPSSlider from '../Slider/component';
import { check4This } from '../../fpsReferences';
import SVGScatterHook from './SVG-Scatter-Hook';

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

  return (
    // Not sure why but have to make this a little smaller here ;(
    <div style={{ width: '97%', }}>
      <div style={ { display: 'flex', gap: '2em' } }>
        <FPSSlider label={ axisMap.horz } initial={ hCenter } min={ hCenter - (diameter) } max={ hCenter + (diameter) } step={ gridGaps[ gridScale ] } onChange={ handleHScroll } style={ sliderStyle } />
        <FPSSlider label={ axisMap.vert } initial={ vCenter } min={ vCenter - (diameter) } max={ vCenter + (diameter) } step={ gridGaps[ gridScale ] } onChange={ handleVScroll } style={ sliderStyle } />
        <FPSSlider label={ 'Scale' } initial={ gridGaps.length -1 } min={ null } max={ null } step={ null } values={ gridGaps } onChange={ handleScaleScroll } style={ sliderStyle } />
      </div>

      <SVGScatterHook

        show={ show }
        axisMap={ axisMap }

        // const { diameter, gridStep, gridlineType, reverseVerticalAxis = false, displaySize, } = chartDisplay;
        chartDisplay={{  ...chartDisplay, ...{ displaySize: useDisplaySize, gridStep: gridGaps[ gridScale ] } }}
        stateSource={ stateSource }

        onDotClick={ null }
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
