import type {
  UseResetProductPageModalReturn,
  UseResetProductPageModalState,
} from '~/composables/useResetProductPageModal/types';

export const useResetProductPageModal: UseResetProductPageModalReturn = () => {
  const state = useState<UseResetProductPageModalState>(`resetProductPageModal`, () => ({
    unlinkModalOpen: false,
    resetType: '',
    loading: false,
  }));

  const toggleResetModal = (value: boolean, resetType?: string) => {
    if (resetType) {
      state.value.resetType = resetType;
    }
    state.value.unlinkModalOpen = value;
  };

  const deleteBlocks = async (identifier: number, type: string) => {
    state.value.loading = true;
    const { send } = useNotification();

    try {
      await useSdk().plentysystems.deleteBlocks({ identifier, type });
    } catch (error) {
      send({ type: 'negative', message: 'An error occurred while deleting blocks.' + error });
    } finally {
      state.value.loading = false;
      send({ type: 'positive', message: 'Blocks deleted successfully.' });

      state.value.unlinkModalOpen = false;
    }
  };

  return { ...toRefs(state.value), toggleResetModal, deleteBlocks };
};
