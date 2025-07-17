import type { UseMegaMenuReturn, UseMegaMenuState } from '~/composables';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

export const useMegaMenu: UseMegaMenuReturn = () => {
  const { setDrawerOpen } = useDrawerState();

  const state = useState<UseMegaMenuState>('useMegaMenu', () => ({
    isOpen: false,
    activeNode: [],
    category: null,
  }));

  const open = () => {
    state.value.isOpen = true;
  };

  const close = () => {
    state.value.isOpen = false;
    setDrawerOpen(false);
  };

  const setCategory = (categoryTree: CategoryTreeItem[]) => {
    state.value.category = {
      id: 0,
      type: 'root',
      itemCount: [],
      right: 'all',
      childCount: categoryTree.length,
      details: [],
      children: categoryTree,
    };
  };

  return {
    ...toRefs(state.value),
    open,
    close,
    setCategory,
  };
};
