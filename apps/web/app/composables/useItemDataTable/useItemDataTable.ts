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

    return {
      itemId: item.id?.toString() ?? '',

      condition: getConditionName(product),

      ageRating: formatAgeRating(t, item.ageRestriction),

      externalVariationId: variation.externalId ?? '',

      model: variation.model ?? '',

      manufacturer: getManufacturerName(product),

      manufacturingCountry: getManufacturingCountryName(product),

      content: formatContent(product),

      grossWeight: formatWeight(variation.weightG),

      netWeight: formatWeight(variation.weightNetG),

      dimensions: formatDimensions(variation.lengthMM, variation.widthMM, variation.heightMM),

      customTariffNumber: variation.customsTariffNumber ?? item.customsTariffNumber ?? '',

      properties: formatVariationProperties(product),
    };
  });

  return {
    fieldValues,
  };
}
