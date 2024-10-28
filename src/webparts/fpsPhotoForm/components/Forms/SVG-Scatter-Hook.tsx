import * as React from 'react';
import './SVG-Scatter.module.css';

// import { useState } from 'react';
import { ISVGScatterHookProps } from './IScatterChartProps';
import { calculatePercentageInRange } from './ScaleCalculations';
import { check4This } from '../../fpsReferences';

const roundToNearest = (num: number ): number => Math.round(num / Math.pow(10, Math.floor(Math.log10(num)))) * Math.pow(10, Math.floor(Math.log10(num)));

const SVGScatterHook: React.FC<ISVGScatterHookProps> = ( props ) => {

  const { show, stateSource,
    chartDisplay,
    horizontalMin,
    horizontalMax,
    verticalMin,
    verticalMax,

    onDotClick, onLineClick,

    svgHeight = '70vh',
    divHeight = '70vh',
    ratio = 1,
  } = props

  const { diameter, gridStep, displaySize, gridlineColor = 'lightgray', gridlineType = 'Solid', reverseVerticalAxis = false, divStyle = {} } = chartDisplay;

  if ( show === false ) return null;

  let strokeDashArray: string = ``;

  if ( gridlineType !== 'Solid' ) {
    // const dashLine = gridStep * ( gridlineType === 'Dashed' ? 10 : 2 )/( displaySize * 4 );
    // const dashGap = gridStep * ( gridlineType === 'Dashed' ? 5 : 5 )/( displaySize * 4 );
    const dashLine = gridlineType === 'Dashed' ? diameter * 1.5 / 100 : diameter * .5 / 100;
    const dashGap = gridlineType === 'Dashed' ? diameter * 1.5 / 100 : diameter * .75 / 100;
    strokeDashArray = `${dashLine},${dashGap}`;
  }

  /**
   * Was trying to add an animation to increase dot size here but was not able to get it to work
   *
   *    const scatterHoverScale = diameter <= 50 ? '' : diameter > 50 && diameter < 300 ? 'diameter100' : diameter >= 300 && diameter < 3000 ? 'diameter3000' : 'diameter6000';
   */

  const scatterHoverScale = ''

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

  const viewBox: string = `${0} ${0} ${diameter} ${diameter * ratio}`;

  return (
    <div className={ `svg-scatter-container`} style={{ ...{ width: '100%', height: divHeight  }, ...{ divStyle } } }>
      {/* Reduced height to accomodate the slider heights */}
      <svg viewBox={ viewBox } style={{ width: '100%', height: svgHeight }}>
        {stateSource.items.map((item, index) => {

          const { Scatter } = item.FPSItem;
          const horzPercent = calculatePercentageInRange(Scatter.horz, horizontalMin, horizontalMax);
          const vertPercent = calculatePercentageInRange(Scatter.vert, verticalMin, verticalMax);
          const cHorizontal = (Scatter.horz - horizontalMin) / (horizontalMax - horizontalMin) * diameter;

          // Adjust cy based on reverseVerticalAxis
          const cVertical = reverseVerticalAxis
            ? (vertPercent / 100) * diameter // Lower z values higher on the Y-axis
            : diameter - (vertPercent / 100) * diameter; // Standard positioning

            if ( check4This( 'tracePerformance=true' ) === true ) {
              console.log(`Scatter.horz: ${Scatter.horz}, horizontalMin: ${horizontalMin}, horizontalMax: ${horizontalMax}, horzPercent: ${horzPercent}`);
              console.log(`Calculated cHorizontal for ${Scatter.horz}: ${cHorizontal}`);
              console.log(`coords: ${index}:`, cHorizontal, cVertical, item);
            }

          return (
            <g key={index}>
              <circle className={ `scatter-point ${scatterHoverScale}` }
                key={index}
                cx={cHorizontal}
                cy={cVertical}
                r={displaySize}
                fill={ Scatter.Color ? Scatter.Color : 'blue'}
                onClick={(event) => onDotClick( item.Id, 'DotClick', item, event )}
              >
                <title>
                  {`Title: ${Scatter.Title}, Category: ${JSON.stringify( Scatter.Category2 ) }, X: ${Scatter.horz}, Y: ${Scatter.vert}`}
                </title>
              </circle>
              <text x={cHorizontal + displaySize * 1.5 } y={cVertical  + displaySize } fontSize={displaySize * 2} fill="black">{Scatter.Title}</text>
            </g>
          );
        })}

        {/* Draw grid lines */}
        {horzGridLines.map((value, i) => {
          const xLinePosition = (value - horizontalMin) / (horizontalMax - horizontalMin) * diameter;
          if ( check4This( 'tracePerformance=true' ) === true ) console.log( `horzGridLines: ${value} is at ${xLinePosition}`);
          const formatNumberLabel = Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();

          return (
            <g key={i}>
              <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke={ gridlineColor } strokeWidth={displaySize / 5}
                  onClick={(event) => onLineClick( 'Horizontal', value , event )} strokeDasharray={ strokeDashArray }/>
              <text x={xLinePosition} y={ displaySize * 3 } fontSize={displaySize * 2} fill="black">{formatNumberLabel}</text>
              <title>{`H Value: ${value}`}</title> {/* Add title for hover effect */}
            </g>
          );
        })}

        {vertGridLines.map((value, i) => {
          const yLinePosition = reverseVerticalAxis
            ? (value - verticalMin) / (verticalMax - verticalMin) * diameter // Normal positioning
            : (verticalMax - value) / (verticalMax - verticalMin) * diameter; // Higher values at the bottom, lower values at the top

            if ( check4This( 'tracePerformance=true' ) === true ) console.log(`vertGridLines: ${value} is at ${yLinePosition}`);
          const formatNumberLabel = Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
          return (
            <g key={i}>
              <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke={ gridlineColor } strokeWidth={displaySize / 5}
                  onClick={(event) => onLineClick( 'Vertical', value , event )} strokeDasharray={ strokeDashArray } />
              <text x={displaySize} y={yLinePosition + displaySize} fontSize={displaySize * 2} fill="black">{formatNumberLabel}</text>
              <title>{`V Value: ${value}`}</title> {/* Add title for hover effect */}
            </g>
          );
        })}

      </svg>
    </div>
  );
};

export default SVGScatterHook;
