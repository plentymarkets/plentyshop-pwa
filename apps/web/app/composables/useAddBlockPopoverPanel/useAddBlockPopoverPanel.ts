import type { BlockListCategory, BlockTemplateVariation } from '~/composables/useBlocksList/types';
import { LAYOUT_PRESETS, type FilterId, type FlatVariation, type UseAddBlockPopoverPanelReturn } from './types';

export const useAddBlockPopoverPanel: UseAddBlockPopoverPanelReturn = () => {
  const { blocksLists, getBlocksLists, pageHasAccessToCategory } = useBlocksList();
  const { addNewBlock, insertCustomBlock, getBlockDepth, blockExistsOnPage } = useBlockManager();
  const { popoverState, closeAddBlockPopover } = useAddBlockPopover();

  const isLoading = useState('useAddBlockPopoverPanel-isLoading', () => false);
  const activeFilters = useState<FilterId[]>('useAddBlockPopoverPanel-activeFilters', () => []);
  const searchQuery = useState('useAddBlockPopoverPanel-searchQuery', () => '');

  const resetState = () => {
    activeFilters.value = [];
    searchQuery.value = '';
  };

  const targetUuid = computed(() => popoverState.value?.targetUuid ?? '');

  // --- Category classification ---

  const isLayoutBlock = (c: BlockListCategory) => c.blockName === 'MultiGrid';
  const isProductOnlyBlock = (c: BlockListCategory) =>
    !!c.accessControl && c.accessControl.length === 1 && c.accessControl[0] === 'product';
  const isCategoryOnlyBlock = (c: BlockListCategory) =>
    !!c.accessControl && c.accessControl.length === 1 && c.accessControl[0] === 'productCategory';

  const accessibleCategories = computed(() => {
    const result: Record<string, BlockListCategory> = {};
    for (const [key, category] of Object.entries(blocksLists.value)) {
      if (pageHasAccessToCategory(category)) result[key] = category;
    }
    return result;
  });

  const contentCategoryList = computed(() =>
    Object.values(accessibleCategories.value).filter(
      (c) => !isLayoutBlock(c) && !isProductOnlyBlock(c) && !isCategoryOnlyBlock(c),
    ),
  );
  const productCategoryList = computed(() => Object.values(accessibleCategories.value).filter(isProductOnlyBlock));
  const pageCategoryList = computed(() => Object.values(accessibleCategories.value).filter(isCategoryOnlyBlock));

  const noFilter = computed(() => activeFilters.value.length === 0);
  const hasActiveFilters = computed(() => activeFilters.value.length > 0);
  const hasActiveSearch = computed(() => searchQuery.value.length > 0);
  const hasProductBlocks = computed(() => productCategoryList.value.length > 0);
  const hasCategoryBlocks = computed(() => pageCategoryList.value.length > 0);

  const toggleFilter = (id: FilterId) => {
    const index = activeFilters.value.indexOf(id);
    if (index >= 0) {
      activeFilters.value = activeFilters.value.filter((f) => f !== id);
    } else {
      activeFilters.value = [...activeFilters.value, id];
    }
  };

  const showLayout = computed(() => noFilter.value || activeFilters.value.includes('layout'));
  const showContent = computed(() => noFilter.value || activeFilters.value.includes('content'));
  const showProduct = computed(
    () => hasProductBlocks.value && (noFilter.value || activeFilters.value.includes('product')),
  );
  const showCategory = computed(
    () => hasCategoryBlocks.value && (noFilter.value || activeFilters.value.includes('category')),
  );

  const matchesSearch = (title: string) =>
    !searchQuery.value || title.toLowerCase().includes(searchQuery.value.toLowerCase());

  const filteredPresets = computed(() => LAYOUT_PRESETS.filter((p) => matchesSearch(p.label)));

  const toFlatVariations = (categories: BlockListCategory[]): FlatVariation[] =>
    categories.flatMap((category) => category.variations.map((variation, idx) => ({ category, variation, idx })));

  const filteredContentVariations = computed(() =>
    toFlatVariations(contentCategoryList.value).filter((item) => matchesSearch(item.variation.title)),
  );
  const filteredProductVariations = computed(() =>
    toFlatVariations(productCategoryList.value).filter((item) => matchesSearch(item.variation.title)),
  );
  const filteredCategoryVariations = computed(() =>
    toFlatVariations(pageCategoryList.value).filter((item) => matchesSearch(item.variation.title)),
  );

  const showLayoutSeparator = computed(
    () =>
      showLayout.value &&
      filteredPresets.value.length > 0 &&
      ((showProduct.value && filteredProductVariations.value.length > 0) ||
        (showCategory.value && filteredCategoryVariations.value.length > 0) ||
        (showContent.value && filteredContentVariations.value.length > 0)),
  );
  const showProductSeparator = computed(
    () =>
      showProduct.value &&
      filteredProductVariations.value.length > 0 &&
      ((showCategory.value && filteredCategoryVariations.value.length > 0) ||
        (showContent.value && filteredContentVariations.value.length > 0)),
  );
  const showCategorySeparator = computed(
    () =>
      showCategory.value &&
      filteredCategoryVariations.value.length > 0 &&
      showContent.value &&
      filteredContentVariations.value.length > 0,
  );

  const hasNoResults = computed(
    () =>
      ![
        showLayout.value && filteredPresets.value.length > 0,
        showProduct.value && filteredProductVariations.value.length > 0,
        showCategory.value && filteredCategoryVariations.value.length > 0,
        showContent.value && filteredContentVariations.value.length > 0,
      ].some(Boolean),
  );

  const isNestedMultigridDisabled = (category: BlockListCategory) =>
    category.blockName === 'MultiGrid' && getBlockDepth(targetUuid.value) > 0;

  const isForbiddenBlockDisabled = (category: BlockListCategory) =>
    ['BannerCarousel', 'ImageText'].includes(category.blockName) && getBlockDepth(targetUuid.value) > 0;

  const isVariationDisabled = (category: BlockListCategory, variation: BlockTemplateVariation) => {
    const blockName = variation.template.en.name;
    return (
      isNestedMultigridDisabled(category) ||
      isForbiddenBlockDisabled(category) ||
      (['SortFilter', 'ItemGrid', 'Navigation'].includes(blockName) && blockExistsOnPage(blockName))
    );
  };

  const selectVariation = async (category: BlockListCategory, variationIndex: number) => {
    if (!popoverState.value) return;
    const { targetUuid: uuid, position } = popoverState.value;
    closeAddBlockPopover();
    await addNewBlock(category.category, variationIndex, uuid, position);
  };

  const onPickPreset = (spans: readonly number[]) => {
    if (!popoverState.value) return;
    const { targetUuid: uuid, position } = popoverState.value;
    const multiGridBlock = {
      name: 'MultiGrid',
      type: 'structure',
      meta: { uuid: '' },
      configuration: { columnWidths: spans, fullWidth: false, visible: true },
      content: spans.map((_, i) => ({
        name: 'EmptyGridBlock',
        type: 'content',
        meta: { uuid: '' },
        parent_slot: i,
        content: [],
      })),
    };
    closeAddBlockPopover();
    insertCustomBlock(multiGridBlock as never, uuid, position);
  };

  const initBlocks = async () => {
    if (Object.keys(blocksLists.value).length === 0) {
      isLoading.value = true;
      try {
        await getBlocksLists();
      } finally {
        isLoading.value = false;
      }
    }
  };

  return {
    isLoading,
    searchQuery,
    activeFilters,
    hasActiveFilters,
    hasActiveSearch,
    hasProductBlocks,
    hasCategoryBlocks,
    toggleFilter,
    showLayout,
    showContent,
    showProduct,
    showCategory,
    filteredPresets,
    filteredContentVariations,
    filteredProductVariations,
    filteredCategoryVariations,
    showLayoutSeparator,
    showProductSeparator,
    showCategorySeparator,
    hasNoResults,
    isVariationDisabled,
    selectVariation,
    onPickPreset,
    initBlocks,
    resetState,
  };
};
