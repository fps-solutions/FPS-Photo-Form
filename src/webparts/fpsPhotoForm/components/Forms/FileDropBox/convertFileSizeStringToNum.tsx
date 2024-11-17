
/**
 *   2024-11-17:  Migrate to fps-core-v7 to @mikezim/fps-core-v7/lib/logic/Math/convertFileSizeStringToNum
 */

export const FileSizeScaleOptions: string[] = ['KB', 'MB', 'GB', 'TB'];
export const FileSizeScaleRegex: RegExp = /^(\d+(\.\d+)?)\s*(KB|MB|GB|TB)$/i;

/**
 * Will convert a string like 1kb or 1KB to 1024
 * @param fileSize
 * @returns
 */
export function convertFileSizeStringToNum(fileSize: string = ''): number {

  // Extract the numeric part and the unit part (KB, MB, GB, TB, etc.)
  const match = fileSize.trim().match(FileSizeScaleRegex);

  if (!match) return parseInt(fileSize);

  const numValue = parseFloat(match[1]);
  const unit = match[3].toUpperCase();

  // Find the index of the scale unit
  const index = FileSizeScaleOptions.indexOf(unit);

  if (index === -1) {
    throw new Error("Unsupported unit");
  }

  // Return the number converted to bytes
  return numValue * Math.pow(1024, index + 1);
}

