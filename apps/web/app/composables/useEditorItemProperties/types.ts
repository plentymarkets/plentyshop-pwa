import type { ApiGroup, ItemPropertyTranslated } from '~/components/blocks/PriceCard/types';
import type { ComputedRef, Ref } from 'vue';

export interface ItemPropertyLocaleMap {
  [locale: string]: string | null;
}

export interface ItemProperty {
  id: number;
  cast: string;
  names: ItemPropertyLocaleMap;
  descriptions: ItemPropertyLocaleMap;
}

export interface ItemPropertyGroup {
  id: number;
  position: number;
  names: ItemPropertyLocaleMap;
  descriptions: ItemPropertyLocaleMap;
  properties: ItemProperty[];
}

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
  insertSelected: () => string[];
}
