import * as React from 'react';
import './ScatterChart.css';
import { ScatterChartProps } from './ScatterChartProps';
import { calculatePercentageInRange } from './ScaleCalculations';


const ScatterChart: React.FC<ScatterChartProps> = ({
  Category1,
  xCenter,
  yCenter,
  diameter,
  stateSource,
  gridStep,
  reverseVerticalAxis = false,
}) => {
  const xMin = xCenter - (diameter / 2);
  const xMax = xCenter + (diameter / 2);
  const yMin = yCenter - (diameter / 2);
  const yMax = yCenter + (diameter / 2);

  const displaySize = diameter / 75; // Default display size for circles

  console.log(`X Range: ${xMin} to ${xMax}`);
  console.log(`Z Range: ${yMin} to ${yMax}`);

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <svg viewBox={`0 0 ${diameter} ${diameter}`} style={{ width: '100%', height: '100%' }}>
        {stateSource.items.map((item, index) => {

          const { Scatter } = item.FPSItem;
          const xPercent = calculatePercentageInRange(Scatter.x, xMin, xMax);
          const yPercent = calculatePercentageInRange(Scatter.y, yMin, yMax);

          const cx = xCenter + (xPercent / 100) * (diameter);

          // Adjust cy based on reverseVerticalAxis
          const cy = reverseVerticalAxis
            ? (yPercent / 100) * diameter // Lower z values higher on the Y-axis
            : diameter - (yPercent / 100) * diameter; // Standard positioning

          console.log(`coords: ${index}:`, cx, cy, item);

          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={displaySize}
              fill={ Scatter.Color ? Scatter.Color : 'blue'}
              onClick={() => alert(Scatter.Title)}
            >
              <title>
                {`Title: ${Scatter.Title}, Category: ${Scatter.Category}, X: ${Scatter.x}, Y: ${Scatter.y}`}
              </title>
            </circle>
          );
        })}

        {/* Draw grid lines */}
        {Array.from({ length: Math.ceil((xMax - xMin) / gridStep) + 1 }).map((_, i) => {
          const xLinePosition = (i * gridStep) / (xMax - xMin) * diameter;

          return (
            <g key={i}>
              <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke="lightgray" strokeWidth={displaySize / 5} />
              <text x={xLinePosition} y={15} fontSize={displaySize * 2} fill="black">{`${i * gridStep + xMin}`}</text>
            </g>
          );
        })}

        {Array.from({ length: Math.ceil((yMax - yMin) / gridStep) + 1 }).map((_, i) => {
          const yLinePosition = diameter - (i * gridStep) / (yMax - yMin) * diameter;

          return (
            <g key={i}>
              <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke="lightgray" strokeWidth={displaySize / 5} />
              <text x={displaySize} y={yLinePosition + displaySize} fontSize={displaySize * 2} fill="black">{`${i * gridStep + yMin}`}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ScatterChart;
