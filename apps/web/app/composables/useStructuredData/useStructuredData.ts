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
import type {
  WithContext,
  Organization as SchemaOrganization,
  Product as SchemaProduct,
  ItemList as SchemaItemList,
  ListItem as SchemaListItem,
  Review as SchemaReview,
  Offer as SchemaOffer,
  PriceSpecification as SchemaPriceSpecification,
  ItemAvailability,
  OfferItemCondition,
} from 'schema-dts';

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
  const localePath = useLocalizedPath();

  const buildProductUrl = (product: Product, isSingleProductUrlSchemeEnabled: boolean): string | undefined => {
    const itemId = productGetters.getItemId(product);
    const urlPath = productGetters.getUrlPath(product);

    if (!itemId || !urlPath) {
      return undefined;
    }

    if (isSingleProductUrlSchemeEnabled) {
      return localePath(`/${urlPath}/a-${itemId}`);
    }

    const basePath = `/${urlPath}_${itemId}`;
    const shouldAppendVariation = productGetters.shouldAppendVariationToLink(product);
    const variationId = productGetters.getVariationId(product);

    return localePath(shouldAppendVariation && variationId ? `${basePath}_${variationId}` : basePath);
  };

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
    const structuredData: WithContext<SchemaOrganization> = {
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
    const runtimeConfig = useRuntimeConfig();
    const isSingleProductUrlSchemeEnabled = useCallisto().isEnabled;

    const { data: productReviews } = useProductReviews(productId);
    const { data: reviewAverage } = useProductReviewAverage(productId);

    const reviewCounts = reviewGetters.getReviewCounts(productReviews.value);
    const totalReviews = reviewGetters.getTotalReviews(reviewCounts);
    const averageRating = reviewGetters.getAverageRating(reviewCounts);

    let reviews: SchemaReview[] | undefined;
    if (reviewAverage.value) {
      const collectedReviews: SchemaReview[] = [];
      reviewGetters.getReviewItems(productReviews.value).forEach((reviewItem) => {
        collectedReviews.push({
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
      reviews = collectedReviews;
    }
    const productPath = buildProductUrl(product, isSingleProductUrlSchemeEnabled);

    const priceSpecification: SchemaPriceSpecification[] = [
      {
        '@type': 'UnitPriceSpecification',
        price: Number(price.value),
        priceCurrency: productGetters.getSpecialPriceCurrency(product),
        priceType: 'SalePrice',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
        },
      },
    ];

    // crossedPrice reads from prices.default when a special offer is active, otherwise from prices.rrp —
    // the currency must be read from whichever source it actually came from, not always the RRP's.
    const specialOffer = productGetters.getSpecialOffer(product);
    const hasListPrice = crossedPrice.value !== null && crossedPrice.value > price.value;
    if (hasListPrice) {
      priceSpecification.push({
        '@type': 'UnitPriceSpecification',
        price: Number(crossedPrice.value),
        priceCurrency: specialOffer
          ? productGetters.getSpecialPriceCurrency(product)
          : productGetters.getRegularPriceCurrency(product),
        priceType: 'ListPrice',
        referenceQuantity: {
          '@type': 'QuantitativeValue',
        },
      });
    }

    const priceValidUntil = productSeoSettingsGetters.getPriceValidUntil(product);
    const offers: SchemaOffer = {
      '@type': 'Offer',
      priceCurrency: productGetters.getSpecialPriceCurrency(product),
      price: Number(price.value),
      url: productPath ? `${runtimeConfig.public.domain}${productPath}` : undefined,
      priceSpecification,
      availability: productSeoSettingsGetters.getMappedAvailability(product) as ItemAvailability,
      itemCondition: productSeoSettingsGetters.getConditionOfItem(product) as OfferItemCondition,
      ...(priceValidUntil !== '' && { priceValidUntil }),
    };

    const metaObject: WithContext<SchemaProduct> = {
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
      offers,
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
    if (isbn !== '') {
      metaObject.additionalProperty = [{ '@type': 'PropertyValue', name: 'isbn', value: isbn }];
    }

    const mpn = productSeoSettingsGetters.getMpn(product);
    if (mpn !== '') metaObject.mpn = mpn;

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
    const isSingleProductUrlSchemeEnabled = useCallisto().isEnabled;

    const itemListElement = products.reduce<SchemaListItem[]>((result, product, index) => {
      const productPath = buildProductUrl(product, isSingleProductUrlSchemeEnabled);

      if (!productPath) {
        return result;
      }

      result.push({
        '@type': 'ListItem',
        position: index + 1,
        url: `${runtimeConfig.public.domain}${productPath}`,
        name: productGetters.getName(product),
      });

      return result;
    }, []);

    const structuredData: WithContext<SchemaItemList> = {
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
      const runtimeConfig = useRuntimeConfig();
      const route = useRoute();

      const canonicalHref =
        productSeoSettingsGetters.getCanonicalHref(canonical) ||
        `${runtimeConfig.public.domain}${localePath(route.path)}`;

      const canonicalUrl = applyTrailingSlashToUrl(canonicalHref);
      useHead({
        link: [{ rel: 'canonical', href: canonicalUrl }],
      });

      const canonicalAlternates = productSeoSettingsGetters.getCanonicalAlternate(canonical);
      const alternateLocales = canonicalAlternates.map((item: CanonicalAlternate) => {
        return {
          rel: 'alternate' as const,
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
