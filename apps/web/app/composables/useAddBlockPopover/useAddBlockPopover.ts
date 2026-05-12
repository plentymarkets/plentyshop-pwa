import type { FilterId, OpenAddBlockPopoverParams, UseAddBlockPopoverReturn, UseAddBlockPopoverState } from './types';

const pendingCancelCallback = ref<(() => void) | null>(null);
const pendingPresetCallback = ref<((spans: readonly number[]) => void) | null>(null);

export const useAddBlockPopover: UseAddBlockPopoverReturn = () => {
  const state = useState<UseAddBlockPopoverState>('useAddBlockPopover', () => ({
    popoverState: null,
    searchQuery: '',
    activeFilters: [],
  }));

  const { setInsertColumnUuid, clearInsertColumnUuid } = useBlocksMutations();

  const toggleFilter = (id: FilterId) => {
    const index = state.value.activeFilters.indexOf(id);
    state.value.activeFilters =
      index >= 0 ? state.value.activeFilters.filter((f) => f !== id) : [...state.value.activeFilters, id];
  };

  const openAddBlockPopover = ({
    anchorEl,
    targetUuid,
    position,
    showLayoutPresets = false,
    onCancel,
    onPresetPick,
  }: OpenAddBlockPopoverParams) => {
    const rect = anchorEl.getBoundingClientRect();

    pendingCancelCallback.value = onCancel ?? null;
    pendingPresetCallback.value = onPresetPick ?? null;

    if (position === 'inside') {
      setInsertColumnUuid(targetUuid);
    } else {
      clearInsertColumnUuid();
    }

    state.value.searchQuery = '';
    state.value.activeFilters = [];
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
    if (pendingCancelCallback.value) {
      pendingCancelCallback.value();
      pendingCancelCallback.value = null;
    }
    pendingPresetCallback.value = null;
    state.value.popoverState = null;
    clearInsertColumnUuid();
  };

  const clearPendingCancel = () => {
    pendingCancelCallback.value = null;
  };

  const consumePresetPick = (spans: readonly number[]): boolean => {
    if (!pendingPresetCallback.value) return false;
    pendingPresetCallback.value(spans);
    pendingPresetCallback.value = null;
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
