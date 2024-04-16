import { createSharedComposable } from '@vueuse/core';

export const useLoginModal = createSharedComposable(() => {
  const isOpen = ref(false);
  const open = () => {
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return {
    isOpen,
    open,
    close,
  };
});
