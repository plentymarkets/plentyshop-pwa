import type { Product, ProductParams } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import type { UseProductReturn, UseProductState, FetchProduct } from '~/composables/useProduct/types';

import { generateBreadcrumbs } from '~/utils/productHelper';

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
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.getProduct(params));
    useHandleError(error.value);

    properties.setProperties(data.value?.data.properties ?? []);
    state.value.data = data.value?.data ?? state.value.data;
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
  const setTitle = () => {
    const title = productGetters.getName(state.value.data);

    useHead({
      title,
    });
  };

  return {
    setTitle,
    setBreadcrumbs,
    fetchProduct,
    ...toRefs(state.value),
    properties,
  };
};
