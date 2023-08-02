import { ref } from 'vue';
import { SfAttribute, SfProduct } from '@vue-storefront/unified-data-model';
import { groupBy, uniqBy } from 'lodash-es';
import type {
  ProductItemDocumentData
} from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';
/**
 * composable for getting product attributes data
 * @param {SfProduct} product Product object
 * @param {TAttribute} attributesNames get specific product attributes
 */
export function useProductAttribute<TAttribute extends string>(product: ProductItemDocumentData, attributesNames: TAttribute[] = []) {
  // const attributes = groupBy(
  //   uniqBy(
  //     (product?.variants || []).flatMap((variant) => variant?.attributes),
  //     'value',
  //   ),
  //   'name',
  // );
  const attributes = [];

  const mapAttribute = (attributes: SfAttribute[] = []) => {
    const defaults = attributesNames.map((attribute) => ({ name: attribute, value: null }));

    return Object.fromEntries([...defaults, ...attributes].map(({ name, value }) => [name, value]));
  };

  // const selectedAttrs = ref(mapAttribute(product.attributes));
  const selectedAttrs = ref([]);

  return {
    // getAttributeList: (attributeName: TAttribute) => attributes[attributeName] || [],
    getAttributeList: (attributeName: TAttribute) => [],
    // getAttribute: (attributeName: TAttribute) => selectedAttrs.value[attributeName],
    getAttribute: (attributeName: TAttribute) => [],
    setAttribute: (attributeName: TAttribute, attributeValue: string) => {
      selectedAttrs.value = {
        ...selectedAttrs.value,
        [attributeName]: attributeValue,
      };
    },
  };
}
