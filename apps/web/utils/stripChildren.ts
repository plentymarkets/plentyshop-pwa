export const stripChildren = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(stripChildren);
  } else if (obj && typeof obj === 'object') {
    const { children, ...rest } = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key in rest) {
      result[key] = stripChildren(rest[key]);
    }
    return result;
  }
  return obj;
};
