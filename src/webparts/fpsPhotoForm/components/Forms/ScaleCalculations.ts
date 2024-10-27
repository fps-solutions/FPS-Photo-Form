import { check4This } from "../../fpsReferences";

export function calculatePercentageInRange(
  x: number,
  min: number,
  max: number,
  returnValid: 'AnyNumber' | 'OnlyBetweenMinMax' = 'AnyNumber',
  clamp: 'LimitToBoundary' | 'ActualPercent' = 'ActualPercent'
): number {
  const range = max - min;

  if (returnValid === 'OnlyBetweenMinMax') {
      // Check if x is within the range
      if (x < min || x > max) {
          // throw new Error(`Value ${x} is out of the range [${min}, ${max}]`);
          console.log(`Value ${x} is out of the range [${min}, ${max}]`);
      }
  }

  let percentage: number;

  // Calculate the percentage for x less than min
  if (x < min) {
      const distance = min - x;
      percentage = -((distance / range) * 100);
  } else {
      // Calculate the distance from the minimum
      const distance = x - min;
      // Calculate the percentage
      percentage = (distance / range) * 100;

      // Adjust percentage if x is above max
      if (x > max) {
          percentage = 100 + ((x - max) / range) * 100;
      }
  }

  // Handle clamping based on the clamp parameter
  if (clamp === 'LimitToBoundary') {
    percentage = Math.max(0, Math.min(percentage, 100));
  }

  if ( check4This( 'tracePerformance=true' ) === true ) console.log( `calculatePercentageInRange: %, x, min, max, clamp, returnValid`, percentage,x, min, max, clamp, returnValid );
  // If clamp is 'ActualPercent', return the actual percentage
  return percentage;
}
