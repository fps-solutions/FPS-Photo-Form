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
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  Category1,
  xCenter,
  yCenter,
  diameter,
  stateSource,
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

  // Determine scale based on the ranges
  const xScale = diameter / (xMax - xMin || 1) * 1; // Scale for x
  const yScale = diameter / (zMax - zMin || 1) * 1; // Scale for z

  // Log scale factors
  console.log(`X Scale: ${xScale}`);
  console.log(`Y Scale: ${yScale}`);

  return (
    <div style={{ width: '100%', height: '700px' }}>
      <svg viewBox={`0 0 ${diameter} ${diameter}`} style={{ width: '100%', height: '100%' }}>
        {stateSource.items.map((item, index) => {
          // Calculate circle position
          const cx = xCenter + (item.x - xMin) * xScale; // Adjust x position
          const cy = diameter - (zMin - item.z) * yScale; // Inverted Y position

          // Log coordinates for debugging
          console.log(`coords: ${index}:`, cx, cy, item);

          // Check if the circle is within bounds
          // if (cx >= 0 && cx <= diameter && cy >= 0 && cy <= diameter) {
          if ( 1 === 1 * 1) {
            console.log(`Visible`);
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
          } else {
            console.log(`Hidden`);
          }
          return null; // Return null if not visible
        })}

        {/* Draw grid lines */}
        {[...Array(13).keys()].map(position => {
          return (
            <g key={position}>
              {/* Vertical Line */}
              <line x1={position * 5 * xScale} y1={0} x2={position * 5 * xScale} y2={diameter} stroke="lightgray" strokeWidth=".25" />
              <text x={position * 5 * xScale} y={3} fontSize="3" fill="black">{`x=${position * 5}`}</text>

              {/* Horizontal Line */}
              <line x1={0} y1={position * 5 * yScale} x2={diameter} y2={position * 5 * yScale} stroke="lightgray" strokeWidth=".25" />
              <text x={1} y={position * 5 * yScale} fontSize="3" fill="black">{`y=${position * 5}`}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ScatterChart;
