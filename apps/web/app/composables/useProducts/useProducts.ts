import type { FacetSearchCriteria, Product, Facet, Block } from '@plentymarkets/shop-api';
import { defaults, type SetCurrentProduct } from '~/composables';
import type { UseProductsState, FetchProducts, UseProductsReturn } from '~/composables/useProducts/types';
import { getCategoryTemplate } from '~/utils/blockTemplates/category';
import { fakeFacetCallEN } from '~/utils/facets/fakeFacetCallEN';
import { fakeFacetCallDE } from '~/utils/facets/fakeFacetCallDE';

const useBlockTemplatesData = async (locale: string) => await getCategoryTemplate(locale);

/**
 * @description Composable for managing products.
 * @returns UseProductsReturn
 * @example
 * ``` ts
 * const { data, loading, productsPerPage, selectedVariation, fetchProducts, selectVariation } = useProducts();
 * ```
 */
export const useProducts: UseProductsReturn = (category = '') => {
  const { normalizeFacetProductNames, normalizeProductName } = useProductNameNormalizer();
  const state = useState<UseProductsState>(`useProducts${category}`, () => ({
    data: {} as Facet,
    loading: false,
    productsPerPage: defaults.DEFAULT_ITEMS_PER_PAGE,
    currentProduct: {} as Product,
  }));

  const isGlobalProductCategoryTemplate = computed(() => {
    const route = useRoute();
    const slugParam = route.params.slug;

    if (slugParam === undefined) {
      return false;
    }

    const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
    return `/${slug}` === paths.globalItemCategory;
  });

  /**
   * @description Function for fetching products.
   * @param params { FacetSearchCriteria }
   * @return FetchProducts
   * @example
   * ``` ts
   * const { fetchProducts: fetchProducts1, data: productsCatalog1 } = useProducts('/living-room');
   * const { fetchProducts: fetchProducts2, data: productsCatalog2 } = useProducts('49');
   * const { fetchProducts: fetchProducts3, data: productsCatalog3 } = useProducts('19');
   *
   * fetchProducts1({ categoryUrlPath: '/living-room', page: 1 });
   * fetchProducts2({ categoryId: '49', page: 1 });
   * fetchProducts3({ categoryId: '19', page: 1 });
   * ```
   */
  const fetchProducts: FetchProducts = async (params: FacetSearchCriteria) => {
    const route = useRoute();
    const { $i18n } = useNuxtApp();
    const { isInEditor } = useEditorState();
    const {
      data: blockData,
      setupBlocks,
      getBlocksServer,
      isFooterBlock,
    } = useBlockTemplates(route?.meta?.identifier as string, route.meta.type as string, $i18n.locale.value);

    state.value.loading = true;

    if (params.categoryUrlPath?.endsWith('.js')) return state.value.data;

    if (isGlobalProductCategoryTemplate.value && isInEditor.value) {
      const fakeFacet = $i18n.locale.value === 'en' ? fakeFacetCallEN : fakeFacetCallDE;

      await getBlocksServer(route.meta.identifier as string, route.meta.type as string);

      const hasContentBlocks = blockData.value?.some((block) => !isFooterBlock(block));
      const fakeBlocks = hasContentBlocks ? blockData.value : await useBlockTemplatesData($i18n.locale.value);

      state.value.data = {
        category: fakeFacet['data'].category,
        products: [],
        facets: [],
        blocks: fakeBlocks,
        languageUrls: {
          'x-default': '',
        },
        pagination: {
          totals: 8,
          perPageOptions: defaults.PER_PAGE_STEPS,
        },
      } as Facet;

      setupBlocks(fakeBlocks);
      handlePreviewProducts(state, $i18n.locale.value);

      state.value.loading = false;
      return state.value.data;
    }

    const identifier = category || params.categoryUrlPath || params.categoryId;

    const { data } = await useAsyncData(`useProducts-${identifier}-${JSON.stringify(params)}`, () =>
      useSdk().plentysystems.getFacet(params),
    );

    state.value.productsPerPage = params.itemsPerPage || defaults.DEFAULT_ITEMS_PER_PAGE;

    if (data.value?.data) {
      data.value.data.pagination.perPageOptions = defaults.PER_PAGE_STEPS;
      state.value.data = normalizeFacetProductNames(data.value.data);
      handlePreviewProducts(state, $i18n.locale.value);

      const defaultData =
        state.value.data.category.type === 'item' ? await useBlockTemplatesData($i18n.locale.value) : [];

      setupBlocks((state.value.data?.blocks?.length ? state.value.data.blocks : defaultData) as Block[]);
    }

    state.value.loading = false;
    return state.value.data;
  };

  /**
   * @description Function for setting the current product.
   * @param product { Product }
   * @return SetCurrentProduct
   * @example
   * ``` ts
   *  setCurrentProduct({} as Product)
   * ```
   */
  const setCurrentProduct: SetCurrentProduct = async (product: Product) => {
    state.value.loading = true;

    state.value.currentProduct = normalizeProductName(product);

    state.value.loading = false;
  };

  return {
    fetchProducts,
    setCurrentProduct,
    isGlobalProductCategoryTemplate,
    ...toRefs(state.value),
  };
};
