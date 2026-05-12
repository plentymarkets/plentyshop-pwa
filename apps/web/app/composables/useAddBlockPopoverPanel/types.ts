import type { BlockListCategory, BlockTemplateVariation } from '~/composables/useBlocksList/types';

export const LAYOUT_PRESETS = [
  { label: '1 Col', spans: [12] },
  { label: '2 Equal', spans: [6, 6] },
  { label: 'Sidebar L', spans: [3, 9] },
  { label: 'Sidebar R', spans: [9, 3] },
  { label: '3 Equal', spans: [4, 4, 4] },
  { label: '4 Equal', spans: [3, 3, 3, 3] },
] as const;

export type FilterId = 'layout' | 'content' | 'product' | 'category';

export interface LayoutPreset {
  label: string;
  spans: readonly number[];
}

export interface FlatVariation {
  category: BlockListCategory;
  variation: BlockTemplateVariation;
  idx: number;
}

export interface UseAddBlockPopoverPanel {
  isLoading: Ref<boolean>;
  searchQuery: Ref<string>;
  activeFilters: Ref<FilterId[]>;
  hasActiveFilters: ComputedRef<boolean>;
  hasActiveSearch: ComputedRef<boolean>;
  hasProductBlocks: ComputedRef<boolean>;
  hasCategoryBlocks: ComputedRef<boolean>;
  toggleFilter: (id: FilterId) => void;
  showLayout: ComputedRef<boolean>;
  showContent: ComputedRef<boolean>;
  showProduct: ComputedRef<boolean>;
  showCategory: ComputedRef<boolean>;
  filteredPresets: ComputedRef<LayoutPreset[]>;
  filteredContentVariations: ComputedRef<FlatVariation[]>;
  filteredProductVariations: ComputedRef<FlatVariation[]>;
  filteredCategoryVariations: ComputedRef<FlatVariation[]>;
  showLayoutSeparator: ComputedRef<boolean>;
  showProductSeparator: ComputedRef<boolean>;
  showCategorySeparator: ComputedRef<boolean>;
  hasNoResults: ComputedRef<boolean>;
  isVariationDisabled: (category: BlockListCategory, variation: BlockTemplateVariation) => boolean;
  selectVariation: (category: BlockListCategory, variationIndex: number) => Promise<void>;
  onPickPreset: (spans: readonly number[]) => void;
  initBlocks: () => Promise<void>;
  resetState: () => void;
}

export type UseAddBlockPopoverPanelReturn = () => UseAddBlockPopoverPanel;
