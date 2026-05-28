import type { FilterId, OpenAddBlockPopoverParams, UseAddBlockPopoverReturn, UseAddBlockPopoverState } from './types';

export const useAddBlockPopover: UseAddBlockPopoverReturn = () => {
  const state = useState<UseAddBlockPopoverState>('useAddBlockPopover', () => ({
    popoverState: null,
    searchQuery: '',
    activeFilters: [],
    pendingCancelCallback: null,
    pendingPresetCallback: null,
  }));

  const { setInsertColumnUuid, clearInsertColumnUuid } = useBlocksMutations();

  const toggleFilter = (id: FilterId) => {
    const index = state.value.activeFilters.indexOf(id);
    state.value.activeFilters =
      index >= 0 ? state.value.activeFilters.filter((f) => f !== id) : [...state.value.activeFilters, id];
  };

  const openAddBlockPopover = async ({
    anchorEl,
    targetUuid,
    position,
    onCancel,
    onPresetPick,
  }: OpenAddBlockPopoverParams) => {
    const initialRect = anchorEl.getBoundingClientRect();

    state.value.pendingCancelCallback = onCancel ?? null;
    state.value.pendingPresetCallback = onPresetPick ?? null;

    if (position === 'inside') {
      setInsertColumnUuid(targetUuid);
    } else {
      clearInsertColumnUuid();
    }

    await nextTick();
    const rect = anchorEl.isConnected ? anchorEl.getBoundingClientRect() : initialRect;

    state.value.searchQuery = '';
    state.value.activeFilters = [];
    state.value.popoverState = {
      anchorCenterX: rect.left + rect.width / 2,
      anchorTop: rect.top,
      anchorBottom: rect.bottom,
      targetUuid,
      position,
    };
  };

  const closeAddBlockPopover = () => {
    if (state.value.pendingCancelCallback) {
      state.value.pendingCancelCallback();
      state.value.pendingCancelCallback = null;
    }
    state.value.pendingPresetCallback = null;
    state.value.popoverState = null;
    clearInsertColumnUuid();
  };

  const clearPendingCancel = () => {
    state.value.pendingCancelCallback = null;
  };

  const consumePresetPick = (spans: readonly number[]): boolean => {
    if (!state.value.pendingPresetCallback) return false;
    state.value.pendingPresetCallback(spans);
    state.value.pendingPresetCallback = null;
    return true;
  };

  return {
    ...toRefs(state.value),
    toggleFilter,
    openAddBlockPopover,
    closeAddBlockPopover,
    clearPendingCancel,
    consumePresetPick,
  };
};
