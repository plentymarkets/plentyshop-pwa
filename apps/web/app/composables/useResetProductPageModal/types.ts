export interface useResetProductPageModalState {
  unlinkModalOpen: boolean;
  resetType: string | null;
}

export interface userResetProductPageModal {
  unlinkModalOpen: Readonly<Ref<useResetProductPageModalState['unlinkModalOpen']>>;
  resetType: Readonly<Ref<useResetProductPageModalState['resetType']>>;
  toggleResetModal: (value: boolean, resetType?: string) => void;
}

export type useResetProductPageModalReturn = () => userResetProductPageModal;
