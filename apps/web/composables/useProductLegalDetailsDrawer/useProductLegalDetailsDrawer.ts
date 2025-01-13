import type { UseProductLegalDetailsMethodsReturn } from './types';

const open = ref(false);

const openDrawer = () => {
  open.value = true;
};

export const useProductLegalDetailsDrawer: UseProductLegalDetailsMethodsReturn = () => {
  return { open, openDrawer };
};
