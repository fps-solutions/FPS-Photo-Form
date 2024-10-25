
function calculatePercentageInRange(
  x: number,
  min: number,
  max: number,
  returnValid: 'AnyNumber' | 'OnlyBetweenMinMax' = 'OnlyBetweenMinMax',
  clamp: 'LimitToBoundary' | 'ActualPercent' = 'LimitToBoundary'
): number {
  const range = max - min;

  if (returnValid === 'OnlyBetweenMinMax') {
      // Check if x is within the range
      if (x < min || x > max) {
          throw new Error(`Value ${x} is out of the range [${min}, ${max}]`);
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
      return Math.max(0, Math.min(percentage, 100));
  }

  // If clamp is 'ActualPercent', return the actual percentage
  return percentage;
}

// Example usage:
const min = -10000;
const max = 2000;

try {
  const x1 = 500; // Within the range
  const percentage1 = calculatePercentageInRange(x1, min, max);
  console.log(`Percentage of ${x1} in range [${min}, ${max}]: ${percentage1}%`);
  // Expected output: 87.5%

  const x2 = -15000; // Below the range
  const percentage2 = calculatePercentageInRange(x2, min, max, 'AnyNumber', 'ActualPercent');
  console.log(`Percentage of ${x2} in range [${min}, ${max}]: ${percentage2}%`);
  // Expected output: -41.67%

  const x3 = 2500; // Above the range
  const percentage3 = calculatePercentageInRange(x3, min, max, 'AnyNumber', 'ActualPercent');
  console.log(`Percentage of ${x3} in range [${min}, ${max}]: ${percentage3}%`);
  // Expected output: 104.17%

  const x4 = -5000; // Below the range with clamping
  const percentage4 = calculatePercentageInRange(x4, min, max);
  console.log(`Percentage of ${x4} in range [${min}, ${max}]: ${percentage4}%`);
  // Expected output: 41.67%

} catch (error) {
  console.error(error.message);
}