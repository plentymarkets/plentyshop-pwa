export type ResetType = 'category' | 'product' | '';

export interface UseResetProductPageModalState {
  unlinkModalOpen: boolean;
  resetType: ResetType;
  loading: boolean;
}

export interface UseResetProductPageModal {
  unlinkModalOpen: Readonly<Ref<UseResetProductPageModalState['unlinkModalOpen']>>;
  resetType: Readonly<Ref<UseResetProductPageModalState['resetType']>>;
  toggleResetModal: (value: boolean, resetType?: ResetType) => void;
  resetBlocks: (identifier: number, type: ResetType) => void;
}

export type UseResetProductPageModalReturn = () => UseResetProductPageModal;
