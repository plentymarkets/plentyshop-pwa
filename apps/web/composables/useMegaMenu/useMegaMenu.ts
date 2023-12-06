import { UseMegaMenuReturn, UseMegaMenuState } from '~/composables';

export const useMegaMenu: UseMegaMenuReturn = () => {
  // const { close, open, isOpen } = useDisclosure();
  const state = useState<UseMegaMenuState>('useMegaMenu', () => ({
    isOpen: false,
    activeNode: [],
  }));

  const open = () => {
    state.value.isOpen = true;
  };

  const close = () => {
    state.value.isOpen = false;
  };

  return {
    ...toRefs(state.value),
    open,
    close,
  };
};
