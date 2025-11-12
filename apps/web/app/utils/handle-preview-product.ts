import { fakeProductDE } from './facets/fakeProductDE';
import { fakeProductEN } from './facets/fakeProductEN';
import type { Product } from '@plentymarkets/shop-api';
import { toRaw, type Ref } from 'vue';
import type { UseProductState } from '~/composables/useProduct/types';

export type ComplementOptions = {
  deep?: boolean;
  treatEmptyStringAsMissing?: boolean;

  excludeKeys?: ReadonlyArray<PropertyKey>;
  excludePaths?: ReadonlyArray<string>;
  excludePathPrefixes?: ReadonlyArray<string>;

  skip?: (ctx: {
    key: PropertyKey | null;
    path: ReadonlyArray<PropertyKey>;
    pathStr: string;
    target: unknown;
    source: unknown;
  }) => boolean;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };
type Path = Array<PropertyKey>;

const isPlainObject = (x: unknown): x is Record<PropertyKey, unknown> =>
  Object.prototype.toString.call(x) === '[object Object]';

const isEmptyObject = (x: unknown): boolean => isPlainObject(x) && Object.keys(x).length === 0;

const isEmptyArray = (x: unknown): x is unknown[] => Array.isArray(x) && x.length === 0;

const isMissing = (value: unknown, treatEmptyStringAsMissing: boolean): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'number' && Number.isNaN(value)) return true;
  if (isEmptyArray(value)) return true;
  if (isEmptyObject(value)) return true;
  if (treatEmptyStringAsMissing && typeof value === 'string' && value.trim() === '') return true;
  return false;
};

const cloneDeepPlain = <T>(input: T): T => {
  if (Array.isArray(input)) return input.map(cloneDeepPlain) as unknown as T;
  if (isPlainObject(input)) {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(input)) out[k] = cloneDeepPlain((input as Record<string, unknown>)[k]);
    return out as unknown as T;
  }
  return input;
};

const joinPath = (path: ReadonlyArray<PropertyKey>): string => path.map((seg) => String(seg)).join('.');

const createShouldSkip = (opts: ComplementOptions) => {
  const keySet = opts.excludeKeys?.length ? new Set(opts.excludeKeys) : null;
  const exactSet = opts.excludePaths?.length ? new Set(opts.excludePaths) : null;
  const prefixList = (opts.excludePathPrefixes ?? []).slice().sort((a, b) => b.length - a.length);

  return (key: PropertyKey | null, path: ReadonlyArray<PropertyKey>, tVal: unknown, sVal: unknown): boolean => {
    if (keySet && key !== null && keySet.has(key)) return true;
    const pathStr = joinPath(path);
    if (exactSet && exactSet.has(pathStr)) return true;
    for (const p of prefixList) {
      if (pathStr === p || pathStr.startsWith(p + '.')) return true; // subtree
    }
    if (opts.skip?.({ key, path, pathStr, target: tVal, source: sVal })) return true;
    return false;
  };
};

const complementTraverse = (
  target: unknown,
  source: unknown,
  opts: ComplementOptions,
  path: Path,
  shouldSkip: (key: PropertyKey | null, path: ReadonlyArray<PropertyKey>, tVal: unknown, sVal: unknown) => boolean,
): void => {
  if (shouldSkip(path[path.length - 1] ?? null, path, target, source)) return;

  const { deep = false, treatEmptyStringAsMissing = false } = opts;

  if (Array.isArray(target) && Array.isArray(source)) {
    if (target.length === 0) {
      (target as unknown[]).splice(0, target.length, ...source);
      return;
    }
    const tArr = target as unknown[];
    const sArr = source as unknown[];
    const max = Math.max(tArr.length, sArr.length);
    for (let i = 0; i < max; i++) {
      const te = tArr[i];
      const se = sArr[i];
      if (se === undefined) continue;
      const idxPath = [...path, i];
      if (shouldSkip(i, idxPath, te, se)) continue;

      if (deep && Array.isArray(te) && Array.isArray(se)) {
        complementTraverse(te, se, opts, idxPath, shouldSkip);
        continue;
      }
      if (deep && isPlainObject(te) && isPlainObject(se)) {
        complementTraverse(te, se, opts, idxPath, shouldSkip);
        continue;
      }
      if (isMissing(te, treatEmptyStringAsMissing)) {
        tArr[i] = se;
      }
    }
    return;
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    const tgt = target as Record<PropertyKey, unknown>;
    const src = source as Record<PropertyKey, unknown>;

    if (isEmptyObject(tgt)) {
      for (const k of Object.keys(src)) {
        const nextPath = [...path, k];
        if (shouldSkip(k, nextPath, tgt[k], src[k])) continue;
        tgt[k] = cloneDeepPlain(src[k]);
      }
      return;
    }

    for (const k of Object.keys(tgt)) {
      if (!Object.prototype.hasOwnProperty.call(src, k)) continue;
      const tVal = tgt[k];
      const sVal = src[k];
      const nextPath = [...path, k];

      if (shouldSkip(k, nextPath, tVal, sVal)) continue;

      if (deep && Array.isArray(tVal) && Array.isArray(sVal)) {
        complementTraverse(tVal, sVal, opts, nextPath, shouldSkip);
        continue;
      }
      if (deep && isPlainObject(tVal) && isPlainObject(sVal)) {
        complementTraverse(tVal, sVal, opts, nextPath, shouldSkip);
        continue;
      }
      if (Array.isArray(tVal) && tVal.length === 0) {
        tgt[k] = sVal;
        continue;
      }
      if (isMissing(tVal, treatEmptyStringAsMissing)) {
        tgt[k] = sVal;
      }
    }
    return;
  }
};

export const complementInPlace = <T extends object>(target: T, source: T, opts: ComplementOptions = {}): T => {
  if (!isPlainObject(source) || !isPlainObject(target)) return target;
  const shouldSkip = createShouldSkip(opts);
  complementTraverse(target, source, opts, [], shouldSkip);
  return target;
};

export const complement = <T extends object>(a: T, b: T, opts: ComplementOptions = {}): T => {
  const clone = cloneDeepPlain(a);
  return complementInPlace(clone, b, opts);
};

export const handlePreviewProduct = (state: Ref<UseProductState>, lang: string) => {
  const { $isPreview } = useNuxtApp();
  if (!$isPreview) return;

  const fakeProduct = lang === 'de' ? fakeProductDE : fakeProductEN;
  const rawA = toRaw(state.value.data) as Product;
  const rawB = fakeProduct as Product;

  state.value.data = complement<Product>(rawA, rawB, {
    deep: true,
    treatEmptyStringAsMissing: true,
    excludePathPrefixes: ['images.variation'],
    excludeKeys: [],
  });
};
