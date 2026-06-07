import * as React from 'react';
import './SVG-Scatter.module.css';

// import { useState } from 'react';
import { ISVGScatterHookProps } from './IScatterChartProps';
import { calculatePercentageInRange } from './ScaleCalculations';
import { check4This } from '../../fpsReferences';

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

const SVGScatterHook: React.FC<ISVGScatterHookProps> = ( props ) => {

  // 2026-06-06: add pan/zoom props and snapStep (default smooth)
  const { show, stateSource,
    chartDisplay,
    scatterSize,

    highlightIds,

    onDotClick, onLineClick,

    svgHeight = '70vh',
    divHeight = '70vh',
    // 2026-06-06: callbacks passed from parent
    onPan, onPanEnd, onZoom,
    // 2026-06-06: snapStep controls snapping unit; default 0 for smooth
    snapStep = 0,

  } = props;

  // refs for drag state and rAF batching
  const svgRef = React.useRef<SVGSVGElement | null>(null); // 2026-06-06
  const dragRef = React.useRef({ dragging: false, startX: 0, startY: 0, startCenterX: 0, startCenterY: 0 }); // 2026-06-06
  const rafRef = React.useRef<number | null>(null); // 2026-06-06
  const lastSentRef = React.useRef({ x: NaN, y: NaN }); // 2026-06-06

  const { diameter, gridStep, displaySize, autoFadeDots, autoFadeText, gridlineColor = 'lightgray', gridlineType = 'Solid', reverseVerticalAxis = false, divStyle = {} } = chartDisplay;
  const { horizontalMin, horizontalMax, verticalMin, verticalMax, ratio = 1, } = scatterSize;

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

  // 2026-06-06: helper to round to nearest multiple
  const roundToNearestMultiple = (current: number, roundTo: number): number => {
    return Math.round(current / roundTo) * roundTo;
  };

  // 2026-06-06: compute chart coords from client pixel coords
  const clientToChart = (clientX: number, clientY: number): { chartX: number; chartY: number; unitsPerPixelX: number; unitsPerPixelY: number } => {
    const svg = svgRef.current;
    if (!svg) return { chartX: 0, chartY: 0, unitsPerPixelX: 0, unitsPerPixelY: 0 };
    const rect = svg.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const svgW = rect.width || 1;
    const svgH = rect.height || 1;
    const unitsPerPixelX = (horizontalMax - horizontalMin) / svgW;
    const unitsPerPixelY = (verticalMax - verticalMin) / svgH;
    const chartX = horizontalMin + px * unitsPerPixelX;
    const chartY = reverseVerticalAxis
      ? verticalMin + py * unitsPerPixelY
      : verticalMax - py * unitsPerPixelY;
    return { chartX, chartY, unitsPerPixelX, unitsPerPixelY };
  };

  // 2026-06-06: pan handler (batched) - send raw values during drag for smoothness
  const schedulePan = (x: number, y: number): void => {
    const outX = x;
    const outY = y;
    if (outX === lastSentRef.current.x && outY === lastSentRef.current.y) return;
    lastSentRef.current = { x: outX, y: outY };
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame((): void => {
      if (onPan) onPan(outX, outY);
    });
  };

  // 2026-06-06: commit snapping on drag end (if enabled)
  const commitSnapOnEnd = (x: number, y: number): void => {
    const snapUnit = snapStep === 0 ? 0 : chartDisplay.gridStep * snapStep;
    const outX = snapUnit > 0 ? roundToNearestMultiple(x, snapUnit) : x;
    const outY = snapUnit > 0 ? roundToNearestMultiple(y, snapUnit) : y;
    // send final snapped value if changed
    if (outX !== lastSentRef.current.x || outY !== lastSentRef.current.y) {
      lastSentRef.current = { x: outX, y: outY };
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame((): void => {
        if (onPan) onPan(outX, outY);
      });
    }
  };

  // 2026-06-06: mouse event handlers for pan/zoom
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    // only primary button
    if (e.button !== 0) return;
    // 2026-06-06: ignore mousedown if target is not the svg root (prevents starting drag when clicking points/lines)
    if (e.target !== e.currentTarget) return;
    const startCenterX = (horizontalMin + horizontalMax) / 2;
    const startCenterY = (verticalMin + verticalMax) / 2;
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, startCenterX, startCenterY };
    // prevent text selection
    (e.target as HTMLElement).closest('.svg-scatter-container')?.classList.add('dragging');
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    if (!dragRef.current.dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const unitsPerPixelX = (horizontalMax - horizontalMin) / (rect.width || 1);
    const unitsPerPixelY = (verticalMax - verticalMin) / (rect.height || 1);
    // 2026-06-06: compute new centers (dragging moves content opposite to pointer)
    const newCenterX = dragRef.current.startCenterX - dx * unitsPerPixelX;
    // 2026-06-06: adjust Y sign so up/down feel natural to user; flip when reverseVerticalAxis is set
    const newCenterY = dragRef.current.startCenterY + (reverseVerticalAxis ? -dy * unitsPerPixelY : dy * unitsPerPixelY);
    schedulePan(newCenterX, newCenterY);
  };

  const handleMouseUp = (_e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    if (!dragRef.current.dragging) return;
    // compute final raw center from lastSentRef values (raw during drag)
    const finalX = lastSentRef.current.x;
    const finalY = lastSentRef.current.y;
    // commit snap if needed
    commitSnapOnEnd(finalX, finalY);
    dragRef.current.dragging = false;
    (document.querySelector('.svg-scatter-container') as HTMLElement)?.classList.remove('dragging');
    if (rafRef.current !== null) { window.cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (onPanEnd) onPanEnd();
  };

  const handleMouseLeave = (e: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    handleMouseUp(e);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>): void => {
    e.preventDefault();
    // 2026-06-06: simple zoom factor by doubling/halving gridStep
    const direction = e.deltaY > 0 ? 1 : -1;
    const factor = direction > 0 ? 2 : 0.5;
    const newGridStep = Math.max(1, Math.round(chartDisplay.gridStep * factor));
    // compute focus point chart coords
    const { chartX, chartY } = clientToChart(e.clientX, e.clientY);
    if (onZoom) onZoom(newGridStep, chartX, chartY);
  };

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
    <div className={ `svg-scatter-container ${ autoFadeDots === true ? 'faded-dots' : '' }`} style={{ ...{ width: '100%', height: divHeight  }, ...{ divStyle } } }>
      {/* Reduced height to accomodate the slider heights */}
      <svg ref={ svgRef } viewBox={ viewBox } style={{ width: '100%', height: svgHeight }}
        onMouseDown={ handleMouseDown }
        onMouseMove={ handleMouseMove }
        onMouseUp={ handleMouseUp }
        onMouseLeave={ handleMouseLeave }
        onWheel={ handleWheel }
      >

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
