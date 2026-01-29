import type { VariationMapProductVariation, VariationMapProductAttribute } from '@plentymarkets/shop-api';
type variationAttributes = {
  variations: VariationMapProductVariation[];
  attributes: VariationMapProductAttribute[];
};
export const variationAttributeMapEN = (variationId: number): variationAttributes => {
  return {
    variations: [
      {
        variationId: variationId,
        isSalable: true,
        unitCombinationId: 1,
        unitId: 1,
        unitName: '1 piece',
        attributes: [
          {
            attributeId: 2,
            attributeValueId: 6,
          },
        ],
      },
      {
        variationId: variationId,
        isSalable: true,
        unitCombinationId: 1,
        unitId: 1,
        unitName: '1 piece',
        attributes: [
          {
            attributeId: 2,
            attributeValueId: 7,
          },
        ],
      },
      {
        variationId: variationId,
        isSalable: true,
        unitCombinationId: 1,
        unitId: 1,
        unitName: '1 piece',
        attributes: [
          {
            attributeId: 2,
            attributeValueId: 11,
          },
        ],
      },
    ],
    attributes: [
      {
        attributeId: 2,
        position: 1,
        name: '(Attribute) Color',
        type: 'box',
        values: [
          {
            attributeValueId: 6,
            position: 2,
            imageUrl: '',
            name: 'red',
          },
          {
            attributeValueId: 7,
            position: 3,
            imageUrl: '',
            name: 'yellow',
          },
          {
            attributeValueId: 11,
            position: 4,
            imageUrl: '',
            name: 'blue',
          },
        ],
      },
      {
        attributeId: 2,
        position: 1,
        name: '(Attribute) Size',
        type: 'box',
        values: [
          {
            attributeValueId: 6,
            position: 2,
            imageUrl: '',
            name: 'S',
          },
          {
            attributeValueId: 7,
            position: 3,
            imageUrl: '',
            name: 'M',
          },
          {
            attributeValueId: 11,
            position: 4,
            imageUrl: '',
            name: 'L',
          },
        ],
      },
    ],
  };
};
