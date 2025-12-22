export interface UseResetProductPageModalState {
  unlinkModalOpen: boolean;
  resetType: string | null;
  loading: boolean;
}

export interface UseResetProductPageModal {
  unlinkModalOpen: Readonly<Ref<UseResetProductPageModalState['unlinkModalOpen']>>;
  resetType: Readonly<Ref<UseResetProductPageModalState['resetType']>>;
  toggleResetModal: (value: boolean, resetType?: string) => void;
  deleteBlocks: (identifier: string | number, type: string) => void;
}

export type UseResetProductPageModalReturn = () => UseResetProductPageModal;
