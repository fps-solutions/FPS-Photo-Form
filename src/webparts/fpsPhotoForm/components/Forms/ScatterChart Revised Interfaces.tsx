// import * as React from 'react';
// import './ScatterChart.css';
// import { ScatterChartProps } from './IScatterChartProps';

// const calculatePercentageInRange = (
//   x: number,
//   min: number,
//   max: number,
//   returnValid: 'AnyNumber' | 'OnlyBetweenMinMax' = 'OnlyBetweenMinMax',
//   clamp: 'LimitToBoundary' | 'ActualPercent' = 'LimitToBoundary'
// ): number => {
//   const range = max - min;

//   if (returnValid === 'OnlyBetweenMinMax') {
//     if (x < min || x > max) {
//       throw new Error(`Value ${x} is out of the range [${min}, ${max}]`);
//     }
//   }

//   let percentage: number;

//   if (x < min) {
//     const distance = min - x;
//     percentage = -((distance / range) * 100);
//   } else {
//     const distance = x - min;
//     percentage = (distance / range) * 100;

//     if (x > max) {
//       percentage = 100 + ((x - max) / range) * 100;
//     }
//   }

//   if (clamp === 'LimitToBoundary') {
//     return Math.max(0, Math.min(percentage, 100));
//   }

//   return percentage;
// };

// const ScatterChart: React.FC<IScatterChartProps> = ({
//   Category1,
//   xCenter,
//   yCenter,
//   diameter,
//   stateSource,
//   gridStep,
//   reverseVerticalAxis = false,
//   axisMap,
// }) => {
//   const xMin = xCenter - (diameter / 2);
//   const xMax = xCenter + (diameter / 2);
//   const zMin = yCenter - (diameter / 2);
//   const zMax = yCenter + (diameter / 2);

//   const displaySize = diameter / 75; // Default display size for circles

//   return (
//     <div style={{ width: '100%', height: '700px' }}>
//       <svg viewBox={`0 0 ${diameter} ${diameter}`} style={{ width: '100%', height: '100%' }}>
//         {stateSource.items.map((item, index) => {
//           const scatterItem = item.FPSItem.Scatter; // Accessing the new structure
//           const xPercent = calculatePercentageInRange(scatterItem.x, xMin, xMax);
//           const yPercent = calculatePercentageInRange(scatterItem.y, zMin, zMax);

//           const cx = xCenter + (xPercent / 100) * diameter;

//           // Adjust cy based on reverseVerticalAxis
//           const cy = reverseVerticalAxis
//             ? (yPercent / 100) * diameter // Lower z values higher on the Y-axis
//             : diameter - (yPercent / 100) * diameter; // Standard positioning

//           return (
//             <g key={index}>
//               {scatterItem.Shape === 'circle' && (
//                 <circle
//                   cx={cx}
//                   cy={cy}
//                   r={displaySize}
//                   fill={scatterItem.Color}
//                   onClick={() => alert(scatterItem.Title)}
//                 >
//                   <title>
//                     {`Title: ${scatterItem.Title}, Category: ${scatterItem.Category}, X: ${scatterItem.x}, Y: ${scatterItem.z}`}
//                   </title>
//                 </circle>
//               )}
//               {/* Additional shapes can be handled here */}
//               {/* For example, add cases for triangles, squares, etc. */}
//             </g>
//           );
//         })}

//         {/* Draw grid lines */}
//         {Array.from({ length: Math.ceil((xMax - xMin) / gridStep) + 1 }).map((_, i) => {
//           const xLinePosition = (i * gridStep) / (xMax - xMin) * diameter;

//           return (
//             <g key={i}>
//               <line x1={xLinePosition} y1={0} x2={xLinePosition} y2={diameter} stroke="lightgray" strokeWidth={displaySize / 5} />
//               <text x={xLinePosition} y={15} fontSize={displaySize * 2} fill="black">{`${i * gridStep + xMin}`}</text>
//             </g>
//           );
//         })}

//         {Array.from({ length: Math.ceil((zMax - zMin) / gridStep) + 1 }).map((_, i) => {
//           const yLinePosition = diameter - (i * gridStep) / (zMax - zMin) * diameter;

//           return (
//             <g key={i}>
//               <line x1={0} y1={yLinePosition} x2={diameter} y2={yLinePosition} stroke="lightgray" strokeWidth={displaySize / 5} />
//               <text x={displaySize} y={yLinePosition + displaySize} fontSize={displaySize * 2} fill="black">{`${i * gridStep + zMin}`}</text>
//             </g>
//           );
//         })}
//       </svg>
//     </div>
//   );
// };

// export default ScatterChart;