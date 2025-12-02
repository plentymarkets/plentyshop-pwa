import type {
  UseResetProductPageModalReturn,
  UseResetProductPageModalState,
} from '~/composables/useResetProductPageModal/types';

export const useResetProductPageModal: UseResetProductPageModalReturn = () => {
  const state = useState<UseResetProductPageModalState>(`resetProductPageModal`, () => ({
    unlinkModalOpen: false,
    resetType: null,
  }));

  const toggleResetModal = (value: boolean, resetType?: string) => {
    if (resetType) {
      state.value.resetType = resetType;
    }
    state.value.unlinkModalOpen = value;
  };

  return { ...toRefs(state.value), toggleResetModal };
};
