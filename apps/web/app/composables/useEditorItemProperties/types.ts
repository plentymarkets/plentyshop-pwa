import type { ApiGroup, ApiProperty, PropSelection } from '~/components/blocks/PriceCard/types';
import type { ComputedRef, Ref } from 'vue';

export type UseEditorItemPropertiesOptions = {
  externalGroups?: () => ApiGroup[] | undefined;
  onInsert?: (tokens: string[]) => void;
  onClose?: () => void;
};

export interface UseEditorItemProperties {
  loading: Ref<boolean>;
  searchQuery: Ref<string>;
  openGroups: Ref<number[]>;
  selection: Ref<Record<number, PropSelection>>;
  groupSelection: Ref<Record<number, { name: boolean }>>;
  filteredGroups: ComputedRef<ApiGroup[]>;
  selectionCount: ComputedRef<number>;
  getGroupName: (group: ApiGroup) => string;
  getPropName: (prop: ApiProperty) => string;
  getPropPlaceholder: (prop: ApiProperty) => string;
  toggleGroup: (id: number) => void;
  toggleSelection: (propId: number, field: 'name' | 'value', checked: boolean) => void;
  toggleGroupItemSelection: (groupId: number, field: 'name', checked: boolean) => void;
  insertSelected: () => void;
}

export interface EditorItemPropertiesEndpoints {
  getEditorItemProperties: (params?: { locale?: string; fallbackLocale?: string }) => Promise<unknown>;
}
