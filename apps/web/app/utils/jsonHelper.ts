export const deepClone = <T>(value: T): T => {
  if (value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
};
export const deepEqual = (object1: unknown, object2: unknown): boolean => {
  if (object1 === object2) return true;

  if (typeof object1 !== typeof object2 || object1 === null || object2 === null) {
    return false;
  }

  if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) return false;
    return object1.every((item, index) => deepEqual(item, object2[index]));
  }

  // Check if both are objects and narrow the types
  if (isObject(object1) && isObject(object2)) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      return deepEqual(object1[key], object2[key]);
    });
  }

  return false;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * @description Recursively overwrites `target` with values from `source`, keeping any property
 * from `target` that is missing on `source` untouched (at every nesting level).
 */
export const deepMergeExisting = <T extends Record<string, unknown>>(target: T, source: DeepPartial<T>): T => {
  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isObject(sourceValue) && !Array.isArray(sourceValue) && isObject(targetValue) && !Array.isArray(targetValue)) {
      result[key] = deepMergeExisting(targetValue, sourceValue as Partial<typeof targetValue>) as T[keyof T];
    } else {
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
};
