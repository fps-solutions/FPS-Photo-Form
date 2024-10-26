import * as React from 'react';
import './ScatterChart.css';

import { useState } from 'react';
import { ScatterChartProps } from './ScatterChartProps';
import { calculatePercentageInRange } from './ScaleCalculations';
import FPSSlider from '../Slider/component';

const roundToNearest = (num: number ): number => Math.round(num / Math.pow(10, Math.floor(Math.log10(num)))) * Math.pow(10, Math.floor(Math.log10(num)));

const ScatterChart: React.FC<ScatterChartProps> = ({
  Category1,
  hCenter,
  vCenter,
  diameter,
  stateSource,
  gridStep,
  reverseVerticalAxis = false,
  axisMap,
}) => {

  const [minX, setMinX] = useState( hCenter - (diameter / 2) ); // Initial minX
  const [minY, setMinY] = useState( vCenter - (diameter / 2) );  // Initial minY
  const [step, setStep] = useState( roundToNearest( diameter / 10 ) );  // Initial minY

  const handleHScroll = (value: number): void => {
    setMinX( value - (diameter / 2) );
  };

  const handleVScroll = (value: number): void => {
    setMinY( value - (diameter / 2) );
  };

  const horizontalMin = minX;
  const horizontalMax = minX + diameter;
  const verticalMin = minY;
  const verticalMax = minY + diameter;

  const displaySize = diameter / 75; // Default display size for circles

  // Create grid line values
  const horzGridLines: number[] = Array.from({ length: Math.floor((horizontalMax - horizontalMin) / gridStep) + 1 }, (_, i) => {
    return horizontalMin + i * gridStep; // THIS works for a sample where diamter is 80 and center is 0
  });

  const vertGridLines: number[] = Array.from({ length: Math.ceil((verticalMax - verticalMin) / gridStep) + 1 }).map((_, i) => {
    return reverseVerticalAxis
    ? verticalMin + i * gridStep // Normal order
    : verticalMax - i * gridStep; // Reverse the order of vertical labels
  });

  console.log( 'reverseVerticalAxis=', reverseVerticalAxis );
  console.log(`H Grid (SVG Left to Right): ${horizontalMin} to ${horizontalMax}`, horzGridLines);
  console.log(`H Grid Lines: ${horzGridLines}`);
  console.log(`V Grid (SVG Top to Bottom): ${verticalMin} to ${verticalMax}`, vertGridLines);

  const sliderStyle: React.CSSProperties = { minWidth: '300px' };
  const viewBox: string = `${0} ${0} ${diameter} ${diameter}`;

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <div style={ { display: 'flex', gap: '2em' } }>
        {/* <FPSSlider label={ axisMap.horz } initial={ hCenter } min={ hCenter - (diameter / 2) } max={ hCenter + (diameter / 2) } step={ step } onChange={ handleHScroll } style={ sliderStyle } />
        <FPSSlider label={ axisMap.vert } initial={ vCenter } min={ vCenter - (diameter / 2) } max={ vCenter + (diameter / 2) } step={ step } onChange={ handleVScroll } style={ sliderStyle } /> */}
        <FPSSlider label={ axisMap.horz } initial={ hCenter } min={ hCenter - (diameter) } max={ hCenter + (diameter) } step={ step } onChange={ handleHScroll } style={ sliderStyle } />
        <FPSSlider label={ axisMap.vert } initial={ vCenter } min={ vCenter - (diameter) } max={ vCenter + (diameter) } step={ step } onChange={ handleVScroll } style={ sliderStyle } />
      </div>
      {/* <input type="range" step={ step } min={ hCenter - (diameter / 2) } max={ hCenter + (diameter / 2) } onChange={handleHScroll} />
      <input type="range" step={ step } min={ vCenter - (diameter / 2) } max={ vCenter + (diameter / 2) } onChange={handleVScroll} /> */}

      <svg viewBox={ viewBox } style={{ width: '100%', height: '100%' }}>
        {stateSource.items.map((item, index) => {

          const { Scatter } = item.FPSItem;
          const horzPercent = calculatePercentageInRange(Scatter.horz, horizontalMin, horizontalMax);
          const vertPercent = calculatePercentageInRange(Scatter.vert, verticalMin, verticalMax);
          console.log(`Scatter.horz: ${Scatter.horz}, horizontalMin: ${horizontalMin}, horizontalMax: ${horizontalMax}, horzPercent: ${horzPercent}`);

          const cHorizontal = (Scatter.horz - horizontalMin) / (horizontalMax - horizontalMin) * diameter;

          console.log(`Calculated cHorizontal for ${Scatter.horz}: ${cHorizontal}`);

          // Adjust cy based on reverseVerticalAxis
          const cVertical = reverseVerticalAxis
            ? (vertPercent / 100) * diameter // Lower z values higher on the Y-axis
            : diameter - (vertPercent / 100) * diameter; // Standard positioning

          console.log(`coords: ${index}:`, cHorizontal, cVertical, item);

          return (
            <circle
              key={index}
              cx={cHorizontal}
              cy={cVertical}
              r={displaySize}
              fill={ Scatter.Color ? Scatter.Color : 'blue'}
              onClick={() => alert(Scatter.Title)}
            >
              <title>
                {`Title: ${Scatter.Title}, Category: ${Scatter.Category}, X: ${Scatter.horz}, Y: ${Scatter.vert}`}
              </title>
            </circle>
          );
        })}

        {/* Draw grid lines */}
        {horzGridLines.map((value, i) => {
          const xLinePosition = (value - horizontalMin) / (horizontalMax - horizontalMin) * diameter;
          console.log( `horzGridLines: ${value} is at ${xLinePosition}`);
          const formatNumberLabel = Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();

          return (
            <g key={i}>
              <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke="lightgray" strokeWidth={displaySize / 5} />
              <text x={xLinePosition} y={ displaySize * 3 } fontSize={displaySize * 2} fill="black">{formatNumberLabel}</text>
              <title>{`H Value: ${value}`}</title> {/* Add title for hover effect */}
            </g>
          );
        })}

        {vertGridLines.map((value, i) => {
          const yLinePosition = reverseVerticalAxis
            ? (value - verticalMin) / (verticalMax - verticalMin) * diameter // Normal positioning
            : (verticalMax - value) / (verticalMax - verticalMin) * diameter; // Higher values at the bottom, lower values at the top

          console.log(`vertGridLines: ${value} is at ${yLinePosition}`);
          const formatNumberLabel = Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
          return (
            <g key={i}>
              <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke="lightgray" strokeWidth={displaySize / 5} />
              <text x={displaySize} y={yLinePosition + displaySize} fontSize={displaySize * 2} fill="black">{formatNumberLabel}</text>
              <title>{`V Value: ${value}`}</title> {/* Add title for hover effect */}
            </g>
          );
        })}

      </svg>
    </div>
  );
};

export default ScatterChart;
