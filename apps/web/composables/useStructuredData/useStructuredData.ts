import type { useStructuredDataReturn } from './types';
import type { SetLogoMeta, SetProductMetaData, UseStructuredDataState } from './types';
import { categoryTreeGetters, productGetters, reviewGetters } from '@plentymarkets/shop-api';
import type { CategoryTreeItem, Product } from '@plentymarkets/shop-api';
import { useProductReviews } from '../useProductReviews';
import { useProductReviewAverage } from '../useProductReviewAverage';

/**
 * @description Composable managing meta data
 * @returns useStructuredDataReturn
 * @example
 * ``` ts
 * const { data, loading, setLogoMeta, setStaticPageMeta } = useMeta();
 * ```
 */
export const useStructuredData: useStructuredDataReturn = () => {
  const state = useState<UseStructuredDataState>(`useMeta`, () => ({
    loading: false,
  }));

  /**
   * @description Function for Setting Logo Metadata.
   * @returns SetLogoMeta
   * @example
   * ``` ts
   * setLogoMeta()
   * ```
   */
  const setLogoMeta: SetLogoMeta = () => {
    state.value.loading = true;

    const runtimeConfig = useRuntimeConfig();
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      url: runtimeConfig.public.domain,
      logo: runtimeConfig.public.domain + '/images/logo.png',
    };
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(structuredData),
        },
      ],
    });

    state.value.loading = false;
  };

  /**
   * @description Function for Setting Single Item Meta
   * @example
   * ``` ts
   * setSingleItemMeta({
   *  product: Product,
   *  categoryTree: CategoryTreeItem
   * })
   * ```
   */
  const setProductMetaData: SetProductMetaData = (product: Product, categoryTree: CategoryTreeItem) => {
    state.value.loading = true;
    const { price, crossedPrice } = useProductPrice(product);
    const productId = Number(productGetters.getItemId(product));

    const { data: productReviews } = useProductReviews(productId);
    const { data: reviewAverage } = useProductReviewAverage(productId);

    const manufacturer = productGetters.getManufacturer(product);
    let reviews = null;
    if (reviewAverage.value) {
      reviews = [];
      reviewGetters.getReviewItems(productReviews.value).forEach((reviewItem) => {
        reviews.push({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: reviewGetters.getReviewRating(reviewItem),
          },
          author: {
            '@type': 'Person',
            name: reviewGetters.getReviewAuthor(reviewItem),
          },
        });
      });
    }
    const metaObject = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      // sku: sku,
      name: productGetters.getName(product),
      category: categoryTreeGetters.getName(categoryTree),
      releaseDate: '',
      image: productGetters.getCoverImage(product),
      identifier: productGetters.getId(product),
      description: product.texts.description,
      disambiguatingDescription: '',
      manufacturer: {
        '@type': 'Organization',
        name: manufacturer.externalName,
      },
      review: reviews,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: productGetters.getAverageRating(product),
        reviewCount: productGetters.getTotalReviews(product),
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: productGetters.getSpecialPriceCurrency(product),
        price: Number(price.value),
        priceValidUntil: productGetters.getVariationAvailableUntil(product),
        url: null,
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: Number(price.value),
            priceCurrency: productGetters.getSpecialPriceCurrency(product),
            priceType: 'SalePrice',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
            },
          },
        ],
        availability: productGetters.isSalable(product)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        itemCondition: null,
      },
      depth: {
        '@type': 'QuantitativeValue',
        value: productGetters.getLengthMM(product),
      },
      width: {
        '@type': 'QuantitativeValue',
        value: productGetters.getWidthMM(product),
      },
      height: {
        '@type': 'QuantitativeValue',
        value: productGetters.getHeightMM(product),
      },
      weight: {
        '@type': 'QuantitativeValue',
        value: productGetters.getWeightG(product),
      },
    };

    if (product.prices?.rrp) {
      metaObject.offers.priceSpecification.push({
        '@type': 'UnitPriceSpecification',
        price: Number(crossedPrice.value),
        priceCurrency: productGetters.getRegularPriceCurrency(product),
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
    setLogoMeta,
    setProductMetaData,
    ...toRefs(state.value),
  };
};
