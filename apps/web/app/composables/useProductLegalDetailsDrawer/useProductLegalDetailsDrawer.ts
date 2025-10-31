import type { UseProductLegalDetailsDrawer } from './types';

const open = ref(false);
const openedBlockUuid = ref<string | null>(null);

const openDrawer = (uuid?: string) => {
  openedBlockUuid.value = uuid ?? null;
  open.value = true;
};

export const useProductLegalDetailsDrawer = (): UseProductLegalDetailsDrawer => {
  return { open, openDrawer, openedBlockUuid };
};
