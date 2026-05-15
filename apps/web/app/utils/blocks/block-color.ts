function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

export function getBlockColor(blockName: string, alpha = 1): string {
  const hue = hashString(blockName) % 360;
  return `hsla(${hue}, 62%, 45%, ${alpha})`;
}
