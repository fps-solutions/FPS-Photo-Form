import * as React from 'react';
// import './ScatterChart.css';

import { useState } from 'react';
import { IScatterChartProps } from './IScatterChartProps';
import FPSSlider from '../Slider/component';
import { check4This } from '../../fpsReferences';
import SVGScatterHook from './SVG-Scatter-Hook';

const roundToNearest = (num: number ): number => Math.round(num / Math.pow(10, Math.floor(Math.log10(num)))) * Math.pow(10, Math.floor(Math.log10(num)));

const ScatterChart: React.FC<IScatterChartProps> = ({
  show,
  hCenter,
  vCenter,
  chartDisplay,
  axisMap,
  stateSource,
}) => {

  const { diameter, gridStep, gridlineType, reverseVerticalAxis = false, displaySize, } = chartDisplay;

  const [minX, setMinX] = useState( hCenter - (diameter / 2) ); // Initial minX
  const [minY, setMinY] = useState( vCenter - (diameter / 2) );  // Initial minY
  const [step, setStep] = useState( roundToNearest( diameter / 10 ) );  // Initial minY

  const useDisplaySize = displaySize ? displaySize : diameter / 75; // Default display size for circles

  const handleHScroll = (value: number): void => {
    setMinX( value - (diameter / 2) );
  };

  const handleVScroll = (value: number): void => {
    setMinY( value - (diameter / 2) );
  };

  if ( show === false ) return null;
  const horizontalMin = minX;
  const horizontalMax = minX + diameter;
  const verticalMin = minY;
  const verticalMax = minY + diameter;

  // Create grid line values
  const horzGridLines: number[] = Array.from({ length: Math.floor((horizontalMax - horizontalMin) / gridStep) + 1 }, (_, i) => {
    return horizontalMin + i * gridStep; // THIS works for a sample where diamter is 80 and center is 0
  });

  const vertGridLines: number[] = Array.from({ length: Math.ceil((verticalMax - verticalMin) / gridStep) + 1 }).map((_, i) => {
    return reverseVerticalAxis
    ? verticalMin + i * gridStep // Normal order
    : verticalMax - i * gridStep; // Reverse the order of vertical labels
  });

  if ( check4This( 'tracePerformance=true' ) === true ) {
    console.log( 'reverseVerticalAxis=', reverseVerticalAxis );
    console.log(`H Grid (SVG Left to Right): ${horizontalMin} to ${horizontalMax}`, horzGridLines);
    console.log(`H Grid Lines: ${horzGridLines}`);
    console.log(`V Grid (SVG Top to Bottom): ${verticalMin} to ${verticalMax}`, vertGridLines);
  }

  const sliderStyle: React.CSSProperties = { minWidth: '300px' };

  return (
    // <div style={{ width: '100%', height: '90vh' }}>
    <div style={{ width: '100%', }}>
      <div style={ { display: 'flex', gap: '2em' } }>
        <FPSSlider label={ axisMap.horz } initial={ hCenter } min={ hCenter - (diameter) } max={ hCenter + (diameter) } step={ step } onChange={ handleHScroll } style={ sliderStyle } />
        <FPSSlider label={ axisMap.vert } initial={ vCenter } min={ vCenter - (diameter) } max={ vCenter + (diameter) } step={ step } onChange={ handleVScroll } style={ sliderStyle } />
      </div>

      <SVGScatterHook

        show={ show }
        axisMap={ axisMap }

        // const { diameter, gridStep, gridlineType, reverseVerticalAxis = false, displaySize, } = chartDisplay;
        chartDisplay={{  ...chartDisplay, ...{ displaySize: useDisplaySize } }}
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
