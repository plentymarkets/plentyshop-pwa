import { fakeProduct } from './facets/fakeProduct';
import type { Product } from '@plentymarkets/shop-api';
import { toRaw, type Ref } from 'vue';
import type { UseProductState } from '~/composables/useProduct/types';

type ComplementOptions = {
  deep?: boolean;
  treatEmptyStringAsMissing?: boolean;
};

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

function isPlainObject(x: unknown): x is object {
  return Object.prototype.toString.call(x) === '[object Object]';
}

function isEmptyObject(x: unknown): boolean {
  return isPlainObject(x) && Object.keys(x as object).length === 0;
}

function isEmptyArray(x: unknown): x is unknown[] {
  return Array.isArray(x) && x.length === 0;
}

function isMissing(value: unknown, treatEmptyStringAsMissing: boolean): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'number' && Number.isNaN(value)) return true;
  if (isEmptyArray(value)) return true;
  if (isEmptyObject(value)) return true;
  if (treatEmptyStringAsMissing && typeof value === 'string' && value.trim() === '') return true; // why: treat whitespace-only as missing
  return false;
}

function cloneDeepPlain<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(cloneDeepPlain) as unknown as T;
  }
  if (isPlainObject(input)) {
    const out: Record<string, unknown> = {};
    const obj = input as Record<string, unknown>;
    for (const k of Object.keys(obj)) {
      out[k] = cloneDeepPlain(obj[k]);
    }
    return out as unknown as T;
  }
  return input;
}

function complementInPlace<T extends object>(target: T, source: T, opts: ComplementOptions = {}): T {
  if (!isPlainObject(target)) throw new TypeError('target must be a plain object');
  if (!isPlainObject(source)) return target;

  const { deep = false, treatEmptyStringAsMissing = false } = opts;

  const tgt = target as unknown as Mutable<T>;
  const src = source as unknown as T;

  for (const key of Object.keys(target) as Array<keyof T>) {
    const pk = key as unknown as PropertyKey;

    if (!Object.prototype.hasOwnProperty.call(src, pk)) continue;

    const tVal = tgt[key] as unknown;
    const sVal = src[key] as unknown;

    if (deep && isPlainObject(tVal) && isPlainObject(sVal)) {
      if (isEmptyObject(tVal)) {
        tgt[key] = sVal as unknown as Mutable<T>[typeof key];
      } else {
        complementInPlace(tVal as object, sVal as object, { deep, treatEmptyStringAsMissing });
      }
      continue;
    }

    if (isEmptyArray(tVal)) {
      tgt[key] = sVal as unknown as Mutable<T>[typeof key];
      continue;
    }

    if (isMissing(tVal, treatEmptyStringAsMissing)) {
      tgt[key] = sVal as unknown as Mutable<T>[typeof key];
    }
  }

  return target;
}

function complement<T extends object>(a: T, b: T, opts: ComplementOptions = {}): T {
  if (!isPlainObject(a)) throw new TypeError('a must be a plain object');
  const clone = cloneDeepPlain(a);
  return complementInPlace(clone, b, opts);
}

export const handlePreviewProduct = (state: Ref<UseProductState>) => {
  const { $isPreview } = useNuxtApp();

  if ($isPreview) {
    const rawA = toRaw(state.value.data) as Product;
    const rawB = fakeProduct as Product;

    state.value.data = complement<Product>(rawA, rawB, {
      deep: true,
      treatEmptyStringAsMissing: true,
    });
  }
};
