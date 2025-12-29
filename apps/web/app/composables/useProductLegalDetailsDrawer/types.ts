export type OpenDrawer = () => void;

export interface UseProductLegalDetailsDrawer {
  open: Ref<boolean>;
  openedBlockUuid: Ref<string | null>;
  openDrawer: (uuid?: string) => void;
}
