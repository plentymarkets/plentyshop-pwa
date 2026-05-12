import type { OpenAddBlockPopoverParams, UseAddBlockPopoverReturn, UseAddBlockPopoverState } from './types';

export const useAddBlockPopover: UseAddBlockPopoverReturn = () => {
  const state = useState<UseAddBlockPopoverState>('useAddBlockPopover', () => ({
    popoverState: null,
  }));

  const { setInsertColumnUuid, clearInsertColumnUuid } = useBlocksMutations();

  const openAddBlockPopover = ({
    anchorEl,
    targetUuid,
    position,
    showLayoutPresets = false,
  }: OpenAddBlockPopoverParams) => {
    const rect = anchorEl.getBoundingClientRect();

    if (position === 'inside') {
      setInsertColumnUuid(targetUuid);
    } else {
      clearInsertColumnUuid();
    }

    state.value.popoverState = {
      anchorCenterX: rect.left + rect.width / 2,
      anchorTop: rect.top,
      anchorBottom: rect.bottom,
      targetUuid,
      position,
      showLayoutPresets,
    };
  };

  const closeAddBlockPopover = () => {
    state.value.popoverState = null;
    clearInsertColumnUuid();
  };

  return {
    ...toRefs(state.value),
    openAddBlockPopover,
    closeAddBlockPopover,
  };
};
