import { createSharedComposable } from '@vueuse/core';
export const useLanguageSelect = createSharedComposable(() => {
  const isOpen = ref(false);
  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  return {
    toggle,
    isOpen,
  };
});
