import type {
  UseResetProductPageModalReturn,
  UseResetProductPageModalState,
} from '~/composables/useResetProductPageModal/types';

export const useResetProductPageModal: UseResetProductPageModalReturn = () => {
  const state = useState<UseResetProductPageModalState>(`resetProductPageModal`, () => ({
    unlinkModalOpen: false,
    resetType: null,
    loading: false,
  }));

  const toggleResetModal = (value: boolean, resetType?: string) => {
    if (resetType) {
      state.value.resetType = resetType;
    }
    state.value.unlinkModalOpen = value;
  };

  const deleteBlocks = async (identifier: string | number, type: string) => {
    state.value.loading = true;

    try {
      await useSdk().plentysystems.deleteBlocks({ identifier, type });
    } catch (error) {
      const { send } = useNotification();
      send({ type: 'negative', message: 'An error occurred while deleting blocks.' + error });
    } finally {
      state.value.loading = false;
      state.value.unlinkModalOpen = false;
    }
  };

  return { ...toRefs(state.value), toggleResetModal, deleteBlocks };
};
