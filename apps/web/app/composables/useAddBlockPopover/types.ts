import type { BlockPosition } from '~/composables/useBlockManager/types';

export type FilterId = 'layout' | 'content' | 'product' | 'category';

export interface AddBlockPopoverState {
  anchorCenterX: number;
  anchorTop: number;
  anchorBottom: number;
  targetUuid: string;
  position: BlockPosition;
}

export interface UseAddBlockPopoverState {
  popoverState: AddBlockPopoverState | null;
  searchQuery: string;
  activeFilters: FilterId[];
  pendingCancelCallback: (() => void) | null;
  pendingPresetCallback: ((spans: readonly number[]) => void) | null;
}

export interface OpenAddBlockPopoverParams {
  anchorEl: HTMLElement;
  targetUuid: string;
  position: BlockPosition;
  onCancel?: () => void;
  onPresetPick?: (spans: readonly number[]) => void;
}

export interface UseAddBlockPopover {
  popoverState: Readonly<Ref<AddBlockPopoverState | null>>;
  searchQuery: Ref<string>;
  activeFilters: Ref<FilterId[]>;
  toggleFilter: (id: FilterId) => void;
  openAddBlockPopover: (params: OpenAddBlockPopoverParams) => Promise<void>;
  closeAddBlockPopover: () => void;
  clearPendingCancel: () => void;
  consumePresetPick: (spans: readonly number[]) => boolean;
}

export type UseAddBlockPopoverReturn = () => UseAddBlockPopover;
