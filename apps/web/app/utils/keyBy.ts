export const keyBy = <T, K extends keyof T | ((item: T) => string | number)>(
  array: T[],
  iteratee: K,
): Record<string | number, T> => {
  return array.reduce<Record<string | number, T>>((acc, obj) => {
    const key =
      typeof iteratee === 'function' ? (iteratee as (item: T) => string | number)(obj) : obj[iteratee as keyof T];

    acc[key as string | number] = obj;
    return acc;
  }, {});
};
