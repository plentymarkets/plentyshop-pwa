export interface UseResetProductPageModalState {
  unlinkModalOpen: boolean;
  resetType: string | null;
}

export interface UseResetProductPageModal {
  unlinkModalOpen: Readonly<Ref<UseResetProductPageModalState['unlinkModalOpen']>>;
  resetType: Readonly<Ref<UseResetProductPageModalState['resetType']>>;
  toggleResetModal: (value: boolean, resetType?: string) => void;
}

export type UseResetProductPageModalReturn = () => UseResetProductPageModal;
