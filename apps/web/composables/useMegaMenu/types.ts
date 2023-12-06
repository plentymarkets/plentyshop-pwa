import type { Ref } from 'vue';

export interface UseMegaMenuState {
  isOpen: boolean;
  activeNode: number[];
}

// export type GetLegalInformation = (params: LegalTextsParams) => Promise<LegalInformationResponse>;
export type OpenMegaMenu = () => void;
export type CloseMegaMenu = () => void;

export interface UseMegaMenuMethods {
  isOpen: Readonly<Ref<UseMegaMenuState['isOpen']>>;
  activeNode: Ref<UseMegaMenuState['activeNode']>;
  open: OpenMegaMenu;
  close: CloseMegaMenu;
}

export type UseMegaMenuReturn = () => UseMegaMenuMethods;
