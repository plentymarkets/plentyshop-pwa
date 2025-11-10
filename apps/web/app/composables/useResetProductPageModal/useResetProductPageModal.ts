import type {
  useResetProductPageModalReturn,
  useResetProductPageModalState,
} from '~/composables/useResetProductPageModal/types';

export const useResetProductPageModal: useResetProductPageModalReturn = () => {
  const state = useState<useResetProductPageModalState>(`resetProductPageModal`, () => ({
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
