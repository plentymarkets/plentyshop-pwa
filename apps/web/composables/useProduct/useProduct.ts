import { categoryTreeGetters, type CategoryTreeItem, Product, type ProductParams } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { type UseProductReturn, UseProductState, type FetchProduct } from '~/composables/useProduct/types';

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
   * @description Function for generating breadcrumbs
   * @example generateBreadcrumbs()
   */
  const generateBreadcrumbs = (categoriesTree: CategoryTreeItem[]) => {
    const { $i18n } = useNuxtApp();

    const breadcrumb = categoryTreeGetters.generateBreadcrumbFromCategory(
      categoriesTree,
      Number(productGetters.getCategoryIds(state.value.data)?.[0] ?? 0),
    );
    breadcrumb.unshift({ name: $i18n.t('home'), link: '/' });
    breadcrumb.push({ name: productGetters.getName(state.value.data), link: `#` });
    state.value.breadcrumbs = breadcrumb;
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
    generateBreadcrumbs,
    fetchProduct,
    ...toRefs(state.value),
    properties,
  };
};
