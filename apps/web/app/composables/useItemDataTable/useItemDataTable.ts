import type { Product } from '@plentymarkets/shop-api';
import type { ItemDataFieldValues } from '~/components/blocks/ItemData/types';

import {
  getConditionName,
  getManufacturingCountryName,
  getManufacturerName,
  formatWeight,
  formatDimensions,
  formatContent,
  formatVariationProperties,
  formatAgeRating,
} from './helpers/ItemDataHelpers';

export function useItemDataTable(productRef: Ref<Product | null>) {
  const { $isPreview } = useNuxtApp();

  const fieldValues = computed<ItemDataFieldValues>(() => {
    const product = productRef.value as Product | null;

    if (!product) {
      return {
        itemId: '',
        condition: '',
        ageRating: '',
        externalVariationId: '',
        model: '',
        manufacturer: '',
        manufacturingCountry: '',
        content: '',
        grossWeight: '',
        netWeight: '',
        dimensions: '',
        customTariffNumber: '',
        properties: '',
      };
    }

    const { item, variation } = product;
    const weightG = variation.weightG ?? null;
    const weightNetG = variation.weightNetG ?? null;
    const lengthMM = variation.lengthMM ?? null;
    const widthMM = variation.widthMM ?? null;
    const heightMM = variation.heightMM ?? null;

    const hideZeroInPreview = $isPreview === true;

    const shouldHideWeightG = hideZeroInPreview && weightG === 0;
    const shouldHideWeightNetG = hideZeroInPreview && weightNetG === 0;
    const allDimsZero =
      hideZeroInPreview &&
      (lengthMM ?? 0) === 0 &&
      (widthMM ?? 0) === 0 &&
      (heightMM ?? 0) === 0;

    return {
      itemId: item.id?.toString() ?? '',

      condition: getConditionName(product),

      ageRating: formatAgeRating(t, item.ageRestriction),

      externalVariationId: variation.externalId ?? '',

      model: variation.model ?? '',

      manufacturer: getManufacturerName(product),

      manufacturingCountry: getManufacturingCountryName(product),

      content: formatContent(product),

      grossWeight: shouldHideWeightG ? '' : formatWeight(weightG),

      netWeight: shouldHideWeightNetG ? '' : formatWeight(weightNetG),

      dimensions: allDimsZero
        ? ''
        : formatDimensions(lengthMM, widthMM, heightMM),

      customTariffNumber: variation.customsTariffNumber ?? item.customsTariffNumber ?? '',

      properties: formatVariationProperties(product),
    };
  });

  return {
    fieldValues,
  };
}
