export const deepEqual = (object1: any, object2: any): boolean => {
  // If both are strictly equal (including handling primitive types)
  if (object1 === object2) return true;

  // If either of the objects is not the same type or is null, return false
  if (typeof object1 !== typeof object2 || object1 === null || object2 === null) {
    return false;
  }

  // Handle arrays by comparing their lengths and contents
  if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) return false;
    return object1.every((item, index) => deepEqual(item, object2[index]));
  }

  // Check if both are objects and narrow the types
  if (isObject(object1) && isObject(object2)) {
    const keys1 = Object.keys(object1); // no cast needed because isObject narrows the type
    const keys2 = Object.keys(object2); // no cast needed because isObject narrows the type

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      return deepEqual(object1[key], object2[key]);
    });
  }

  return false;
};

// Type guard to check if value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
