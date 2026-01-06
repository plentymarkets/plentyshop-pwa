import { fakeProductDE } from './facets/fakeProductDE';
import { fakeProductEN } from './facets/fakeProductEN';
import type { Product } from '@plentymarkets/shop-api';
import { toRaw, type Ref } from 'vue';
import type { UseProductState } from '~/composables/useProduct/types';
import { variationAttributeMapEN } from './facets/variationAttributeMapEN';
import { variationAttributeMapDE } from './facets/variationAttributeMapDE';
import { variationPropertiesEN } from './facets/variationPropertiesEN';
import { variationPropertiesDE } from './facets/variationPropertiesDE';
import { bundleComponentsDE } from './facets/bundleComponentsDE';
import { bundleComponentsEN } from './facets/bundleComponentsEN';
import { propertiesEN } from './facets/propertiesEN';
import { propertiesDE } from './facets/propertiesDE';

type PlainObject = Record<string, unknown>;

export const complement = <T>(
  a: Partial<T> | T,
  b: T,
  forcedKeys?: ReadonlyArray<string> | ReadonlySet<string>,
  ignoredKeys?: ReadonlyArray<string> | ReadonlySet<string>,
): T =>
  mergeComplement({
    a,
    b,
    forced: toSet(forcedKeys),
    ignored: toSet(ignoredKeys),
    path: '',
  }) as T;

type MergeOpts = {
  a: unknown;
  b: unknown;
  forced: Set<string>;
  ignored: Set<string>;
  path: string;
};

const toSet = (keys?: ReadonlyArray<string> | ReadonlySet<string>): Set<string> =>
  !keys ? new Set() : keys instanceof Set ? new Set(keys) : new Set(keys);

const isMissing = (value: unknown): boolean =>
  value == null || (typeof value === 'string' && value.length === 0) || (Array.isArray(value) && value.length === 0);

const isPlainObject = (value: unknown): value is PlainObject => {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const shallowCloneObject = <T extends PlainObject>(obj: T): T =>
  Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);

const cloneValue = (v: unknown): unknown => {
  if (Array.isArray(v)) return (v as unknown[]).slice();
  if (isPlainObject(v)) return shallowCloneObject(v);
  return v;
};

const matches = (set: Set<string>, key: string, path: string): boolean =>
  set.has(key) || (path ? set.has(`${path}.${key}`) : set.has(key));

const mergeComplement = ({ a, b, forced, ignored, path }: MergeOpts): unknown => {
  if (isPlainObject(a) && isPlainObject(b)) {
    const result: PlainObject = {};
    const keys = new Set<string>([...Object.keys(a), ...Object.keys(b)]);

    for (const key of keys) {
      const aHas = Object.prototype.hasOwnProperty.call(a, key);
      const bHas = Object.prototype.hasOwnProperty.call(b, key);
      const nextPath = path ? `${path}.${key}` : key;
      const ignoredHere = matches(ignored, key, path);
      const forcedHere = matches(forced, key, path);

      if (ignoredHere) {
        if (aHas) result[key] = cloneValue((a as PlainObject)[key]);
        continue;
      }

      if (aHas) {
        const av = (a as PlainObject)[key];
        const bv = bHas ? (b as PlainObject)[key] : undefined;

        if (forcedHere && bHas) {
          result[key] = cloneValue(bv);
        } else if (isMissing(av) && bHas) {
          result[key] = cloneValue(bv);
        } else if (isPlainObject(av) && isPlainObject(bv)) {
          result[key] = mergeComplement({ a: av, b: bv, forced, ignored, path: nextPath });
        } else {
          result[key] = cloneValue(av);
        }
      } else if (bHas) {
        result[key] = cloneValue((b as PlainObject)[key]);
      }
    }
    return result;
  }

  if (isPlainObject(a)) return shallowCloneObject(a);
  if (isPlainObject(b)) return isMissing(a) ? shallowCloneObject(b) : a;

  return !isMissing(a) ? cloneValue(a) : cloneValue(b);
};

export const handlePreviewProduct = (state: Ref<UseProductState>, lang: string) => {
  const { $isPreview } = useNuxtApp();
  if (!$isPreview) return;

  const fakeProduct: Product = lang === 'de' ? fakeProductDE : fakeProductEN;
  if (state.value.data && state.value.data.variation && state.value.data.variation.id) {
    fakeProduct.variationAttributeMap =
      lang === 'de'
        ? variationAttributeMapDE(Number(state.value.data.variation.id))
        : variationAttributeMapEN(Number(state.value.data.variation.id));
  }
  fakeProduct.variationProperties = lang === 'de' ? variationPropertiesDE : variationPropertiesEN;
  fakeProduct.bundleComponents = lang === 'de' ? bundleComponentsDE : bundleComponentsEN;
  fakeProduct.properties = lang === 'de' ? propertiesDE : propertiesEN;

  const rawA = toRaw(state.value.data) as Product;
  const rawB = fakeProduct as Product;
  state.value.fakeData = complement<Product>(rawA, rawB, ['prices.graduatedPrices'], ['images']);
};
