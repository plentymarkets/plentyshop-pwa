import type {
  useStructuredDataReturn,
  SetLogoMeta,
  SetProductMetaData,
  SetItemListMetaData,
  SetProductRobotsMetaData,
  SetProductCanonicalMetaData,
  UseStructuredDataState,
} from './types';
import { productGetters, reviewGetters, productSeoSettingsGetters } from '@plentymarkets/shop-api';
import type { Product, CanonicalAlternate } from '@plentymarkets/shop-api';

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
  const { applyToUrl: applyTrailingSlashToUrl } = useUrlTrailingSlash();

  const safeSerializeJsonLd = (value: unknown, space?: number) =>
    JSON.stringify(value, null, space).replaceAll('<', String.raw`\u003C`);

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
      logo: runtimeConfig.public.domain + '/_nuxt-plenty/images/logo.png',
    };
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: safeSerializeJsonLd(structuredData),
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
   *  category: CategoryTreeItem
   * })
   * ```
   */
  const setProductMetaData: SetProductMetaData = (product: Product) => {
    state.value.loading = true;
    const { price, crossedPrice } = useProductPrice(product);
    const productId = Number(productGetters.getItemId(product));

    const { data: productReviews } = useProductReviews(productId);
    const { data: reviewAverage } = useProductReviewAverage(productId);

    const reviewCounts = reviewGetters.getReviewCounts(productReviews.value);
    const totalReviews = reviewGetters.getTotalReviews(reviewCounts);
    const averageRating = reviewGetters.getAverageRating(reviewCounts);

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
      name: productGetters.getName(product),
      category: productGetters.getCategoryName(product),
      releaseDate: '',
      image: productGetters.getCoverImage(product),
      identifier: productGetters.getId(product),
      description: product.texts.description,
      disambiguatingDescription: '',
      review: reviews,
      ...(totalReviews > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating,
          reviewCount: totalReviews,
        },
      }),
      offers: {
        '@type': 'Offer',
        priceCurrency: productGetters.getSpecialPriceCurrency(product),
        price: Number(price.value),
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
        availability: productSeoSettingsGetters.getMappedAvailability(product),
        itemCondition: productSeoSettingsGetters.getConditionOfItem(product),
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const manufacturer = productSeoSettingsGetters.getSeoManufacturer(product);
    if (manufacturer !== '') metaObject.manufacturer = { '@type': 'Organization', name: manufacturer };

    const brand = productSeoSettingsGetters.getBrand(product);
    if (brand !== '') metaObject.brand = { '@type': 'Brand', name: brand };

    const sku = productSeoSettingsGetters.getSku(product);
    if (sku !== '') metaObject.sku = sku;

    const gtin = productSeoSettingsGetters.getGtin(product);
    if (gtin !== '') metaObject.gtin = gtin;

    const gtin8 = productSeoSettingsGetters.getGtin8(product);
    if (gtin8 !== '') metaObject.gtin8 = gtin8;

    const gtin13 = productSeoSettingsGetters.getGtin13(product);
    if (gtin13 !== '') metaObject.gtin13 = gtin13;

    const isbn = productSeoSettingsGetters.getIsbn(product);
    if (isbn !== '') metaObject.isbn = productSeoSettingsGetters.getIsbn(product);

    const mpn = productSeoSettingsGetters.getMpn(product);
    if (mpn !== '') metaObject.mpn = mpn;

    const priceValidUntil = productSeoSettingsGetters.getPriceValidUntil(product);
    if (priceValidUntil !== '') metaObject.offers.priceValidUntil = priceValidUntil;

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
          innerHTML: safeSerializeJsonLd(metaObject, 4),
        },
      ],
    });
    state.value.loading = false;
  };

  const setItemListMetaData: SetItemListMetaData = (products: Product[]) => {
    state.value.loading = true;

    const runtimeConfig = useRuntimeConfig();
    const route = useRoute();
    const localePath = useLocalePath();
    const isSingleProductUrlSchemeEnabled = useCallisto().isEnabled;

    const itemListElement = products.reduce<Array<Record<string, unknown>>>((result, product, index) => {
      const itemId = productGetters.getItemId(product);
      const urlPath = productGetters.getUrlPath(product);

      if (!itemId || !urlPath) {
        return result;
      }

      let productPath = '';

      if (isSingleProductUrlSchemeEnabled) {
        productPath = localePath(`/${urlPath}/a-${itemId}`);
      } else {
        const basePath = `/${urlPath}_${itemId}`;
        const shouldAppendVariation = productGetters.shouldAppendVariationToLink(product);
        const variationId = productGetters.getVariationId(product);

        productPath = localePath(shouldAppendVariation && variationId ? `${basePath}_${variationId}` : basePath);
      }

      result.push({
        '@type': 'ListItem',
        position: index + 1,
        url: `${runtimeConfig.public.domain}${productPath}`,
        name: productGetters.getName(product),
      });

      return result;
    }, []);

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: itemListElement.length,
      url: `${runtimeConfig.public.domain}${localePath(route.fullPath)}`,
      itemListElement,
    };

    useHead({
      script: [
        {
          key: 'item-list-structured-data',
          type: 'application/ld+json',
          innerHTML: safeSerializeJsonLd(structuredData),
        },
      ],
    });

    state.value.loading = false;
  };

  const setProductRobotsMetaData: SetProductRobotsMetaData = (product: Product) => {
    state.value.loading = true;

    const route = useRoute();
    let robotsContent = product.seoSettings?.robots || '';

    if (
      (!product.seoSettings?.forceRobotsValue && Object.keys(route.query).length > 0) ||
      product.seoSettings?.forceNoIndex
    ) {
      robotsContent = 'noindex';
    }

    useHead({
      meta: [{ name: 'robots', content: robotsContent }],
    });

    state.value.loading = false;
  };

  const setProductCanonicalMetaData: SetProductCanonicalMetaData = (product: Product) => {
    state.value.loading = true;

    const canonical = productSeoSettingsGetters.getCanonical(product);

    if (canonical) {
      const canonicalUrl = applyTrailingSlashToUrl(productSeoSettingsGetters.getCanonicalHref(canonical));
      useHead({
        link: [{ rel: 'canonical', href: canonicalUrl }],
      });

      const canonicalAlternates = productSeoSettingsGetters.getCanonicalAlternate(canonical);
      const alternateLocales = canonicalAlternates.map((item: CanonicalAlternate) => {
        return {
          rel: 'alternate',
          hreflang: productSeoSettingsGetters.getCanonicalAlternateHreflang(item),
          href: applyTrailingSlashToUrl(productSeoSettingsGetters.getCanonicalAlternateHref(item)),
        };
      });

      useHead({
        link: alternateLocales,
      });

      useSeoMeta({
        ogUrl: canonicalUrl,
      });
    }
    state.value.loading = false;
  };

  return {
    setLogoMeta,
    setProductMetaData,
    setItemListMetaData,
    setProductRobotsMetaData,
    setProductCanonicalMetaData,
    ...toRefs(state.value),
  };
};
