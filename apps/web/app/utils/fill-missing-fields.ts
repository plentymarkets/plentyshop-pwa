type PlainObject = Record<string, unknown>;
type TreatAsEmpty = (path: string, value: unknown) => boolean;

type MergeContext = {
  forced: Set<string>;
  ignored: Set<string>;
  path: string;
  treatAsEmpty?: TreatAsEmpty;
};

export type FillMissingFieldsOptions = {
  forcedKeys?: ReadonlyArray<string> | ReadonlySet<string>;
  ignoredKeys?: ReadonlyArray<string> | ReadonlySet<string>;
  treatAsEmpty?: TreatAsEmpty;
};

const toSet = (keys?: ReadonlyArray<string> | ReadonlySet<string>): Set<string> => (keys ? new Set(keys) : new Set());

const isEmpty = (value: unknown): boolean =>
  value == null || (typeof value === 'string' && value.length === 0) || (Array.isArray(value) && value.length === 0);

const isPlainObject = (value: unknown): value is PlainObject => {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const shallowCloneObject = <T extends PlainObject>(object: T): T =>
  Object.assign(Object.create(Object.getPrototypeOf(object)), object);

const cloneValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return (value as unknown[]).slice();
  if (isPlainObject(value)) return shallowCloneObject(value);
  return value;
};

const matches = (set: Set<string>, key: string, path: string): boolean =>
  set.has(key) || set.has(`${path}.${key}`);

const mergePropertyValue = (
  realValue: unknown,
  defaultValue: unknown,
  context: { isForced: boolean; hasDefaultValue: boolean; mergeContext: MergeContext },
): unknown => {
  if (shouldUseDefaultValue(realValue, context.isForced, context.hasDefaultValue, context.mergeContext)) {
    return cloneValue(defaultValue);
  }
  if (isPlainObject(realValue) && isPlainObject(defaultValue)) {
    return mergeComplement(realValue, defaultValue, context.mergeContext);
  }
  return cloneValue(realValue);
};

const shouldUseDefaultValue = (
  realValue: unknown,
  isForced: boolean,
  hasDefault: boolean,
  context: MergeContext,
): boolean => {
  if (!hasDefault) return false;
  if (isForced) return true;
  if (context.treatAsEmpty?.(context.path, realValue)) return true;
  return isEmpty(realValue);
};

const mergeObjectProperties = (
  realObject: PlainObject,
  defaultObject: PlainObject,
  context: MergeContext,
): PlainObject => {
  const { forced, ignored, path, treatAsEmpty } = context;
  const result: PlainObject = {};
  const keys = new Set<string>([...Object.keys(realObject), ...Object.keys(defaultObject)]);

  for (const key of keys) {
    const realHasProperty = Object.hasOwn(realObject, key);
    const defaultHasProperty = Object.hasOwn(defaultObject, key);
    const nextPath = path ? `${path}.${key}` : key;
    const isIgnoredKey = matches(ignored, key, path);
    const isForcedKey = matches(forced, key, path);

    if (isIgnoredKey) {
      if (realHasProperty) result[key] = cloneValue(realObject[key]);
      continue;
    }

    if (realHasProperty) {
      const realValue = realObject[key];
      const defaultValue = defaultHasProperty ? defaultObject[key] : undefined;
      const nextContext: MergeContext = { forced, ignored, path: nextPath, treatAsEmpty };

      result[key] = mergePropertyValue(realValue, defaultValue, {
        isForced: isForcedKey,
        hasDefaultValue: defaultHasProperty,
        mergeContext: nextContext,
      });
    } else if (defaultHasProperty) {
      result[key] = cloneValue(defaultObject[key]);
    }
  }
  return result;
};

const mergeComplement = (realValue: unknown, defaultValue: unknown, context: MergeContext): unknown => {
  if (isPlainObject(realValue) && isPlainObject(defaultValue)) {
    return mergeObjectProperties(realValue, defaultValue, context);
  }

  if (isPlainObject(realValue)) return shallowCloneObject(realValue);
  if (isPlainObject(defaultValue)) return isEmpty(realValue) ? shallowCloneObject(defaultValue) : realValue;

  return isEmpty(realValue) ? cloneValue(defaultValue) : cloneValue(realValue);
};

/**
 * Fills missing fields in the real object with values from the default object.
 *
 * @param real - The primary object (real data)
 * @param defaultObject - The fallback object (default/fake data)
 * @param options - Configuration options
 * @param options.forcedKeys - Keys that should always use values from default regardless of whether real has them
 * @param options.ignoredKeys - Keys that should never be filled from default, keeping only real values
 * @param options.treatAsEmpty - Optional callback to determine if a value should be treated as empty/missing
 * @returns A merged object with missing fields filled in
 *
 * @example
 * ```ts
 * const realProduct = { name: 'Phone', price: null };
 * const defaultProduct = { name: 'Example', price: 100, description: 'Fake' };
 * const result = fillMissingFields(realProduct, defaultProduct);
 * // { name: 'Phone', price: 100, description: 'Fake' }
 *
 * // With options
 * const result2 = fillMissingFields(realProduct, defaultProduct, {
 *   forcedKeys: ['prices.graduatedPrices'],
 *   ignoredKeys: ['images'],
 *   treatAsEmpty: (path, value) => path.includes('weight') && value === 0,
 * });
 * ```
 */
export const fillMissingFields = <T>(real: Partial<T> | T, defaultObject: T, options?: FillMissingFieldsOptions): T =>
  mergeComplement(real, defaultObject, {
    forced: toSet(options?.forcedKeys),
    ignored: toSet(options?.ignoredKeys),
    path: '',
    treatAsEmpty: options?.treatAsEmpty,
  }) as T;
