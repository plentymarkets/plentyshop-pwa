import type { VariationMapProductVariation, VariationMapProductAttribute } from '@plentymarkets/shop-api';

export type variationAttributes = {
  variations: VariationMapProductVariation[];
  attributes: VariationMapProductAttribute[];
};
