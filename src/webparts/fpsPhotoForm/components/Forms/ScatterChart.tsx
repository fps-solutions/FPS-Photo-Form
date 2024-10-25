import * as React from 'react';
import './ScatterChart.css';

interface IStateSource {
  items: IAnySourceItem[];
}

interface IAnySourceItem {
  x: number;
  y: number;
  z: number;
  Category: string;
  Title: string;
}

interface ScatterChartProps {
  Category1: string;
  xCenter: number; // Center x coordinate
  yCenter: number; // Center y coordinate
  diameter: number; // Total height of the chart
  stateSource: IStateSource;
  gridStep: number; // Step for grid lines
}

const calculatePercentageInRange = (
  x: number,
  min: number,
  max: number,
  returnValid: 'AnyNumber' | 'OnlyBetweenMinMax' = 'OnlyBetweenMinMax',
  clamp: 'LimitToBoundary' | 'ActualPercent' = 'LimitToBoundary'
): number => {
  const range = max - min;

  if (returnValid === 'OnlyBetweenMinMax') {
    // Check if x is within the range
    if (x < min || x > max) {
      throw new Error(`Value ${x} is out of the range [${min}, ${max}]`);
    }
  }

  let percentage: number;

  if (x < min) {
    const distance = min - x;
    percentage = -((distance / range) * 100);
  } else {
    const distance = x - min;
    percentage = (distance / range) * 100;

    if (x > max) {
      percentage = 100 + ((x - max) / range) * 100;
    }
  }

  if (clamp === 'LimitToBoundary') {
    return Math.max(0, Math.min(percentage, 100));
  }

  return percentage;
};

const ScatterChart: React.FC<ScatterChartProps> = ({
  Category1,
  xCenter,
  yCenter,
  diameter,
  stateSource,
  gridStep,
}) => {
  const radius = 5; // Default radius for circles

  // Calculate min and max for x and z
  const xValues = stateSource.items.map(item => item.x);
  const zValues = stateSource.items.map(item => item.z);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const zMin = Math.min(...zValues);
  const zMax = Math.max(...zValues);

  // Log min and max values for scaling
  console.log(`X Range: ${xMin} to ${xMax}`);
  console.log(`Z Range: ${zMin} to ${zMax}`);

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <svg viewBox={`0 0 ${diameter} ${diameter}`} style={{ width: '100%', height: '100%' }}>
        {stateSource.items.map((item, index) => {
          const xPercent = calculatePercentageInRange(item.x, xMin, xMax);
          const yPercent = calculatePercentageInRange(item.z, zMin, zMax);

          // Calculate circle position
          const cx = xCenter + (xPercent / 100) * (diameter);
          const cy = diameter - (yPercent / 100) * (diameter); // Inverted Y position

          // Log coordinates for debugging
          console.log(`coords: ${index}:`, cx, cy, item);

          return (
            <circle
              key={index}
              cx={cx}
              cy={cy}
              r={radius}
              fill="blue"
              onClick={() => alert(item.Title)}
            >
              <title>
                {`Title: ${item.Title}, Category: ${item.Category}, X: ${item.x}, Y: ${item.z}`}
              </title>
            </circle>
          );
        })}

        {/* Draw grid lines */}
        {Array.from({ length: Math.ceil((xMax - xMin) / gridStep) + 1 }).map((_, i) => {
          const xLinePosition = (i * gridStep) / (xMax - xMin) * diameter;

          return (
            <g key={i}>
              <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke="lightgray" strokeWidth=".25" />
              <text x={xLinePosition} y={15} fontSize="8" fill="black">{`${i * gridStep + xMin}`}</text>
            </g>
          );
        })}

        {Array.from({ length: Math.ceil((zMax - zMin) / gridStep) + 1 }).map((_, i) => {
          const yLinePosition = diameter - (i * gridStep) / (zMax - zMin) * diameter;

          return (
            <g key={i}>
              <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke="lightgray" strokeWidth=".25" />
              <text x={5} y={yLinePosition + 5} fontSize="8" fill="black">{`${i * gridStep + zMin}`}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ScatterChart;
