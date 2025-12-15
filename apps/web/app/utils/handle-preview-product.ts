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
import { fillMissingFields } from './fill-missing-fields';

const DIMENSION_FIELDS_WITH_ZERO_DEFAULT = new Set([
  'variation.weightG',
  'variation.weightNetG',
  'variation.lengthMM',
  'variation.widthMM',
  'variation.heightMM',
]);

const isDimensionFieldWithZero = (path: string, value: unknown): boolean =>
  DIMENSION_FIELDS_WITH_ZERO_DEFAULT.has(path) && value === 0;

const getFakeProductForLanguage = (lang: string, variationId?: number): Product => {
  const baseFakeProduct = lang === 'de' ? fakeProductDE : fakeProductEN;

  const getVariationAttributeMap = () => {
    if (!variationId) return undefined;
    return lang === 'de' ? variationAttributeMapDE(variationId) : variationAttributeMapEN(variationId);
  };

  return {
    ...baseFakeProduct,
    variationAttributeMap: getVariationAttributeMap(),
    variationProperties: lang === 'de' ? variationPropertiesDE : variationPropertiesEN,
    bundleComponents: lang === 'de' ? bundleComponentsDE : bundleComponentsEN,
    properties: lang === 'de' ? propertiesDE : propertiesEN,
  };
};

export const handlePreviewProduct = (state: Ref<UseProductState>, lang: string, shouldComplement: boolean) => {
  const { $isPreview } = useNuxtApp();
  if (!$isPreview) return;

  const variationId = state.value.data?.variation?.id;
  const fakeProduct = getFakeProductForLanguage(lang, variationId ? Number(variationId) : undefined);
  const realProduct = toRaw(state.value.data);

  state.value.fakeData = shouldComplement
    ? fillMissingFields<Product>(realProduct, fakeProduct, {
        forcedKeys: ['prices.graduatedPrices'],
        ignoredKeys: ['images'],
        treatAsEmpty: isDimensionFieldWithZero,
      })
    : fakeProduct;
};
