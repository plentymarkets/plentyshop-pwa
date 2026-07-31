import type { ApiGroup, ItemPropertyTranslated } from '~/components/blocks/PriceCard/types';
import type { PropertyPlaceholderToken } from '~/composables/useRichTextEditor/types';
export type { ItemPropertyGroup, ItemProperty, ItemPropertyLocaleMap } from '@plentymarkets/shop-api';

export interface PropSelection {
  name: boolean;
  value: boolean;
}

export interface UseEditorItemProperties {
  loading: Ref<boolean>;
  searchQuery: Ref<string>;
  openGroups: Ref<number[]>;
  selection: Ref<Record<number, PropSelection>>;
  groupSelection: Ref<Record<number, { name: boolean }>>;
  filteredGroups: ComputedRef<ApiGroup[]>;
  selectionCount: ComputedRef<number>;
  getGroupName: (group: ApiGroup) => string;
  getPropName: (prop: ItemPropertyTranslated) => string;
  getPropPlaceholder: (prop: ItemPropertyTranslated) => string;
  toggleGroup: (id: number) => void;
  toggleSelection: (propId: number, field: 'name' | 'value', checked: boolean) => void;
  toggleGroupItemSelection: (groupId: number, field: 'name', checked: boolean) => void;
  insertSelected: () => PropertyPlaceholderToken[];
}
