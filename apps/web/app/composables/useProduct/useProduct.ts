import type { Block, Product, ProductParams } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import type { UseProductReturn, UseProductState, FetchProduct } from '~/composables/useProduct/types';

import { generateBreadcrumbs } from '~/utils/productHelper';
import productTemplateData from '~/composables/useCategoryTemplate/productTemplateData.json';

const useProductTemplateData = () => productTemplateData as Block[];

/**
 * @description Composable managing product data
 * @param slug Product slug
 * @returns UseProductReturn
 * @example
 * ``` ts
 * const { data, loading, fetchProduct } = useProduct('product-slug');
 * ```
 */
export const useProduct: UseProductReturn = (slug) => {
  const properties = useProductOrderProperties();
  const state = useState<UseProductState>(`useProduct-${slug}`, () => ({
    data: {} as Product,
    loading: false,
    breadcrumbs: [],
  }));

  /** Function for fetching product data.
   * @param params { ProductParams }
   * @return FetchProduct
   * @example
   * ``` ts
   * fetchProduct({
   *   id: 1,
   *   variationId: 1
   * });
   * ```
   */
  const fetchProduct: FetchProduct = async (params: ProductParams) => {
    state.value.loading = true;
    const { $i18n } = useNuxtApp();
    const route = useRoute();
    const { setupBlocks } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);

    const { data, error } = await useAsyncData(
      `fetchProduct-${params.id}-${params.variationId}-${$i18n.locale.value}`,
      () => useSdk().plentysystems.getProduct(params),
    );
    useHandleError(error.value ?? null);
    await setupBlocks(
      (state.value.data.blocks?.length ? state.value.data.blocks : useProductTemplateData()) as Block[],
    );

    properties.setProperties(data.value?.data.properties ?? []);
    state.value.data = data.value?.data ?? ({} as Product);
    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for setting breadcrumbs
   * @example setBreadcrumbs()
   */
  const setBreadcrumbs = () => {
    const { data: categoryTree } = useCategoryTree();
    const { $i18n } = useNuxtApp();

    state.value.breadcrumbs = generateBreadcrumbs(categoryTree.value, state.value.data, $i18n.t('home'));
  };

  /**
   * @description Function for setting product title meta data
   */
  const setProductMeta = () => {
    const { titleSuffix } = useAppConfig();

    const title =
      productGetters.getTitle(state.value.data) || `${productGetters.getName(state.value.data)} | ${titleSuffix}`;

    useHead({
      title,
      titleTemplate: '',
      meta: [
        {
          name: 'description',
          content: productGetters.getMetaDescription(state.value.data) || process.env.METADESC,
        },
        {
          name: 'keywords',
          content: productGetters.getMetaKeywords(state.value.data) || process.env.METAKEYWORDS,
        },
      ],
    });
  };

  return {
    setProductMeta,
    setBreadcrumbs,
    fetchProduct,
    ...toRefs(state.value),
    properties,
  };
};
