import * as React from 'react';
import './ScatterChart.css';
import { ScatterChartProps } from './ScatterChartProps';
import { calculatePercentageInRange } from './ScaleCalculations';


const ScatterChart: React.FC<ScatterChartProps> = ({
  Category1,
  hCenter,
  vCenter,
  diameter,
  stateSource,
  gridStep,
  reverseVerticalAxis = false,
}) => {
  const horizontalMin = hCenter - (diameter / 2);
  const horizontalMax = hCenter + (diameter / 2);
  const verticalMin = vCenter - (diameter / 2);
  const verticalMax = vCenter + (diameter / 2);

  const displaySize = diameter / 75; // Default display size for circles

  console.log(`X Range: ${horizontalMin} to ${horizontalMax}`);
  console.log(`Z Range: ${verticalMin} to ${verticalMax}`);

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <svg viewBox={`0 0 ${diameter} ${diameter}`} style={{ width: '100%', height: '100%' }}>
        {stateSource.items.map((item, index) => {

          const { Scatter } = item.FPSItem;
          const horzPercent = calculatePercentageInRange(Scatter.horz, horizontalMin, horizontalMax);
          const vertPercent = calculatePercentageInRange(Scatter.vert, verticalMin, verticalMax);

          const cHorizontal = hCenter + (horzPercent / 100) * (diameter);

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
        {Array.from({ length: Math.ceil((horizontalMax - horizontalMin) / gridStep) + 1 }).map((_, i) => {
          const xLinePosition = (i * gridStep) / (horizontalMax - horizontalMin) * diameter;

          return (
            <g key={i}>
              <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke="lightgray" strokeWidth={displaySize / 5} />
              <text x={xLinePosition} y={ displaySize } fontSize={displaySize * 2} fill="black">{`${i * gridStep + horizontalMin}`}</text>
            </g>
          );
        })}

        {Array.from({ length: Math.ceil((verticalMax - verticalMin) / gridStep) + 1 }).map((_, i) => {
          const yLinePosition = diameter - (i * gridStep) / (verticalMax - verticalMin) * diameter;

          return (
            <g key={i}>
              <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke="lightgray" strokeWidth={displaySize / 5} />
              <text x={displaySize} y={yLinePosition + displaySize} fontSize={displaySize * 2} fill="black">{`${i * gridStep + verticalMin}`}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ScatterChart;
