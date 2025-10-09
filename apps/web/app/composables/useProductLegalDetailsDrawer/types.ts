export type OpenDrawer = () => void;

export interface UseProductLegalDetailsMethods {
  open: Readonly<Ref<boolean>>;
  openDrawer: OpenDrawer;
}

export type UseProductLegalDetailsMethodsReturn = () => UseProductLegalDetailsMethods;
