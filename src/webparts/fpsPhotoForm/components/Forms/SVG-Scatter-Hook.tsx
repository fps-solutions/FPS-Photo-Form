import * as React from 'react';
import './SVG-Scatter.module.css';

// import { useState } from 'react';
import { ISVGScatterHookProps } from './IScatterChartProps';
import { calculatePercentageInRange } from './ScaleCalculations';
import { check4This } from '../../fpsReferences';

const SVGScatterHook: React.FC<ISVGScatterHookProps> = ( props ) => {

  const { show, stateSource,
    chartDisplay,
    scatterSize,

    highlightIds,

    onDotClick, onLineClick,

    svgHeight = '70vh',
    divHeight = '70vh',

  } = props

  const { diameter, gridStep, displaySize, autoFadeDots, autoFadeText, gridlineColor = 'lightgray', gridlineType = 'Solid', reverseVerticalAxis = false, divStyle = {} } = chartDisplay;
  const { horizontalMin, horizontalMax, verticalMin, verticalMax, ratio = 1, } = scatterSize;

  if ( show === false ) return null;

  let strokeDashArray: string = ``;

  if ( gridlineType !== 'Solid' ) {
    const dashLine = gridlineType === 'Dashed' ? diameter * 1.5 / 100 : diameter * .5 / 100;
    const dashGap = gridlineType === 'Dashed' ? diameter * 1.5 / 100 : diameter * .75 / 100;
    strokeDashArray = `${dashLine},${dashGap}`;
  }

  const getLabel = (value: number): string => {

    const label: string = Math.abs(value) >= 1000 ? `${(value / 1000).toFixed( gridStep >= 1000 ? 0 : gridStep >= 100 ? 1 : 2 )}k` : value.toString();

    return label;
};

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

  console.log(`H Grid (SVG Left to Right): ${horizontalMin} to ${horizontalMax}`, horzGridLines);
  console.log(`V Grid (SVG Top to Bottom): ${verticalMin} to ${verticalMax}`, vertGridLines);

  if ( check4This( 'tracePerformance=true' ) === true ) {
    console.log( 'reverseVerticalAxis=', reverseVerticalAxis );
    console.log(`H Grid Lines: ${horzGridLines}`);
  }

  const viewBox: string = `${0} ${0} ${diameter} ${diameter * ratio}`;

  return (
    <div className={ `svg-scatter-container ${ autoFadeDots === true ? 'faded-dots' : '' }`} style={{ ...{ width: '100%', height: divHeight  }, ...{ divStyle } } }>
      {/* Reduced height to accomodate the slider heights */}
      <svg viewBox={ viewBox } style={{ width: '100%', height: svgHeight }}>

        {/* Draw horizontal grid lines */}
        {horzGridLines.map((value, i) => {
          const xLinePosition = (value - horizontalMin) / (horizontalMax - horizontalMin) * diameter;
          if ( check4This( 'tracePerformance=true' ) === true ) console.log( `horzGridLines: ${value} is at ${xLinePosition}`);

          return (
            <g key={i}>
              <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke={ gridlineColor } strokeWidth={displaySize / 5}
                  onClick={(event) => onLineClick( 'Horizontal', value , event )} strokeDasharray={ strokeDashArray }/>
              <text x={xLinePosition} y={ displaySize * 3 } fontSize={displaySize * 2} fill="black">{getLabel(value)}</text>
              <title>{`H Value: ${value}`}</title> {/* Add title for hover effect */}
            </g>
          );
        })}

        {/* Draw vertical grid lines */}
        {vertGridLines.map((value, i) => {
          const yLinePosition = reverseVerticalAxis
            ? (value - verticalMin) / (verticalMax - verticalMin) * diameter // Normal positioning
            : (verticalMax - value) / (verticalMax - verticalMin) * diameter; // Higher values at the bottom, lower values at the top

            if ( check4This( 'tracePerformance=true' ) === true ) console.log(`vertGridLines: ${value} is at ${yLinePosition}`);

          return (
            <g key={i}>
              <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke={ gridlineColor } strokeWidth={displaySize / 5}
                  onClick={(event) => onLineClick( 'Vertical', value , event )} strokeDasharray={ strokeDashArray } />
              <text x={displaySize} y={yLinePosition + displaySize} fontSize={displaySize * 2} fill="black">{getLabel(value)}</text>
              <title>{`V Value: ${value}`}</title> {/* Add title for hover effect */}
            </g>
          );
        })}

        {/* Draw circles from items */}
        {/* CIRCLES ARE LAST - because that way they are on top of the other elements */}
        {stateSource.itemsY.map((item, index) => {

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
          <g className={ highlightIds.indexOf( item.Id ) > -1 ? 'no-fade' : '' } key={index}>
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
            <text x={cHorizontal + displaySize * 1.5 } y={cVertical  + displaySize }
              fontSize={displaySize * 2} fill="black" className={ autoFadeText === true ? 'faded-text' : '' }>{Scatter.Title}</text>
          </g>
        );
        })}
      </svg>
    </div>
  );
};

export default SVGScatterHook;
