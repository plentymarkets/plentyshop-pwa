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
    fakeData: {} as Product,
    loading: false,
    breadcrumbs: [],
  }));

  const isGlobalProductDetailsTemplate = computed(() => {
    const route = useRoute();
    const slugParam = route.params.slug;
    const itemIdParam = route.params.itemId;

    if (slugParam === undefined || itemIdParam === undefined) {
      return false;
    }

    const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
    const itemId = Array.isArray(itemIdParam) ? itemIdParam.join('/') : itemIdParam;

    return `/${slug}_${itemId}` === paths.globalItemDetails;
  });

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
    const route = useRoute();
    const { $i18n, $isPreview } = useNuxtApp();
    const {
      data: blockData,
      setupBlocks,
      getBlocksServer,
    } = useCategoryTemplate(
      route?.meta?.identifier as string,
      route.meta.type as string,
      useNuxtApp().$i18n.locale.value,
    );

    state.value.loading = true;

    if (isGlobalProductDetailsTemplate.value && $isPreview) {
      const fakeProduct = $i18n.locale.value === 'en' ? fakeProductEN : fakeProductDE;

      await getBlocksServer(route.meta.identifier as string, route.meta.type as string);
      const blocks = blockData.value?.length ? blockData.value : useProductTemplateData();

      state.value.data = {
        blocks: blocks,
        ...fakeProduct,
      };

      setupBlocks(blocks);

      handlePreviewProduct(state, $i18n.locale.value, false);

      state.value.loading = false;
      return state.value.data;
    }

    const { data, error } = await useAsyncData(
      `fetchProduct-${params.id}-${params.variationId}-${$i18n.locale.value}`,
      () => useSdk().plentysystems.getProduct(params),
    );
    useHandleError(error.value ?? null);

    const fetchedBlocks = data.value?.data.blocks;
    setupBlocks(fetchedBlocks && fetchedBlocks.length > 0 ? fetchedBlocks : useProductTemplateData());

    properties.setProperties(data.value?.data.properties ?? []);
    state.value.data = data.value?.data ?? ({} as Product);
    handlePreviewProduct(state, $i18n.locale.value, true);
    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for setting breadcrumbs
   * @example setBreadcrumbs()
   */
  const setBreadcrumbs = () => {
    const { data: categoryTree } = useCategoryTree();

    state.value.breadcrumbs = generateBreadcrumbs(categoryTree.value, state.value.data, t('common.labels.home'));
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
  const { disableActions } = useEditor();
  const { $isPreview } = useNuxtApp();

  const productForEditor = computed(() =>
    $isPreview && disableActions.value ? state.value.fakeData : state.value.data,
  );

  return {
    setProductMeta,
    setBreadcrumbs,
    fetchProduct,
    ...toRefs(state.value),
    properties,
    productForEditor,
  };
};
