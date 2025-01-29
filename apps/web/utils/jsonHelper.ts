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
