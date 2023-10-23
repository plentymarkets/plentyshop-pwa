import { toRefs } from '@vueuse/shared';
import type { UseSeoMetaReturn } from './types';
import { SingleItemMeta, UseMetaState } from './types';
import type { Product } from '@plentymarkets/shop-api';
import { categoryTreeGetters, productGetters } from '@plentymarkets/shop-sdk';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';
/**
 * @description Composable managing meta data
 * @returns UseSeoMetaReturn
 * @example
 * ``` ts
 * const { data, loading, setStaticPageMeta } = useMeta();
 * ```
 */
export const useSeoMeta: UseSeoMetaReturn = () => {
  const state = useState<UseMetaState>(`useMeta`, () => ({
    loading: false,
  }));

  /**
   * @description Function for Setting page Meta
   * @returns SingleItemMeta
   * @example
   * ``` ts
   * setSigleItemMeta()
   * ```
   */
  const setSingleItemMeta: SingleItemMeta = (product: Product, variationId: string, categoryTree: CategoryTreeItem) => {
    state.value.loading = true;
    const manufacturer = product.item.manufacturer as { name: string };
    const metaObject = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': variationId,
      name: productGetters.getName(product),
      category: categoryTreeGetters.getName(categoryTree),
      releaseDate: '',
      image: productGetters.getCoverImagePreview(product),
      identifier: variationId,
      description: product.texts.description,
      disambiguatingDescription: '',
      manufacturer: {
        '@type': 'Organization',
        name: manufacturer.name,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: product.prices?.default.currency,
        price: product.prices?.default.price.value,
        priceValidUntil: null,
        url: null,
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: product.prices?.default.price.value,
            priceCurrency: product.prices?.default.currency,
            priceType: 'SalePrice',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
            },
          },
        ],
        availability: product.variation.availability,
        itemCondition: null,
      },
      depth: {
        '@type': 'QuantitativeValue',
        value: product.variation.lengthMM,
      },
      width: {
        '@type': 'QuantitativeValue',
        value: product.variation.widthMM,
      },
      height: {
        '@type': 'QuantitativeValue',
        value: product.variation.heightMM,
      },
      weight: {
        '@type': 'QuantitativeValue',
        value: product.variation.weightG,
      },
    };
    if (product.prices?.rrp) {
      metaObject.offers.priceSpecification.push({
        '@type': 'UnitPriceSpecification',
        price: product.prices?.rrp.price.value,
        priceCurrency: product.prices?.rrp.currency,
        priceType: 'ListPrice',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
        },
      });
    }
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(metaObject),
        },
      ],
    });
    state.value.loading = false;
  };

  return {
    setSingleItemMeta,
    ...toRefs(state.value),
  };
};
