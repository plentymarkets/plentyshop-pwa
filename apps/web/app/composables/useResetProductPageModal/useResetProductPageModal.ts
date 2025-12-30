import type {
  UseResetProductPageModalReturn,
  UseResetProductPageModalState,
  ResetType,
} from '~/composables/useResetProductPageModal/types';

export const useResetProductPageModal: UseResetProductPageModalReturn = () => {
  const state = useState<UseResetProductPageModalState>(`resetProductPageModal`, () => ({
    unlinkModalOpen: false,
    resetType: '' as ResetType,
    loading: false,
  }));

  const toggleResetModal = (value: boolean, resetType?: ResetType) => {
    if (resetType) {
      state.value.resetType = resetType;
    }
    state.value.unlinkModalOpen = value;
  };

  const resetBlocks = async (identifier: number, type: ResetType) => {
    state.value.loading = true;
    const { send } = useNotification();

    try {
      await useSdk().plentysystems.deleteBlocks({ identifier, type });
      send({ type: 'positive', message: 'Blocks reseted successfully. Please refresh the page.' });
      state.value.unlinkModalOpen = false;
    } catch (error) {
      send({ type: 'negative', message: `An error occurred while resetting the blocks. ${error}` });
    } finally {
      state.value.loading = false;
    }
  };

  return { ...toRefs(state.value), toggleResetModal, resetBlocks };
};
