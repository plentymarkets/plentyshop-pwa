import type { BlockPosition } from '~/composables/useBlockManager/types';

export interface AddBlockPopoverState {
  anchorCenterX: number;
  anchorTop: number;
  anchorBottom: number;
  targetUuid: string;
  position: BlockPosition;
  showLayoutPresets: boolean;
}

export interface UseAddBlockPopoverState {
  popoverState: AddBlockPopoverState | null;
}

export interface OpenAddBlockPopoverParams {
  anchorEl: HTMLElement;
  targetUuid: string;
  position: BlockPosition;
  showLayoutPresets?: boolean;
}

export interface UseAddBlockPopover {
  popoverState: Readonly<Ref<AddBlockPopoverState | null>>;
  openAddBlockPopover: (params: OpenAddBlockPopoverParams) => void;
  closeAddBlockPopover: () => void;
}

export type UseAddBlockPopoverReturn = () => UseAddBlockPopover;
