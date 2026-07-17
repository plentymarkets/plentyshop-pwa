/**
 * Hash a string to a number using the djb2 algorithm.
 *
 * http://www.cse.yorku.ca/~oz/hash.html
 * https://stackoverflow.com/questions/1579721/why-are-5381-and-33-so-important-in-the-djb2-algorithm
 * @param textToHash
 */
function hashString(textToHash: string): number {
  let currentHash = 5381;

  for (let characterIndex = 0; characterIndex < textToHash.length; characterIndex++) {
    const characterCode = textToHash.charCodeAt(characterIndex);
    currentHash = ((currentHash << 5) + currentHash) ^ characterCode;
    currentHash = currentHash >>> 0;
  }

  return currentHash;
}

export function getBlockColor(blockName: string, alpha = 1): string {
  const largeHashValue = hashString(blockName);
  const colorHueDegree = largeHashValue % 360;

  const saturationPercentage = 62;
  const lightnessPercentage = 45;

  return `hsla(${colorHueDegree}, ${saturationPercentage}%, ${lightnessPercentage}%, ${alpha})`;
}
