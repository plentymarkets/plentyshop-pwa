import type { FilterId, OpenAddBlockPopoverParams, UseAddBlockPopoverReturn, UseAddBlockPopoverState } from './types';

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
  }: OpenAddBlockPopoverParams) => {
    const rect = anchorEl.getBoundingClientRect();

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
    state.value.popoverState = null;
    clearInsertColumnUuid();
  };

  return {
    ...toRefs(state.value),
    toggleFilter,
    openAddBlockPopover,
    closeAddBlockPopover,
  };
};
