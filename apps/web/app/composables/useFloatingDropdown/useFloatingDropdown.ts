import type { CSSProperties } from 'vue';

export type FloatingDropdownAlign = 'left' | 'right';

export const useFloatingDropdown = (options?: {
  align?: FloatingDropdownAlign;
  offset?: number;
  handleClickOutside?: boolean;
}) => {
  const align = options?.align ?? 'left';
  const offset = options?.offset ?? 4;
  const handleClickOutside = options?.handleClickOutside ?? true;

  const triggerRef = ref<HTMLElement | null>(null);
  const open = ref(false);
  const floatingStyle = ref<CSSProperties>({});

  const updatePosition = (alignOverride?: FloatingDropdownAlign) => {
    const effectiveAlign = alignOverride ?? align;
    const rect = triggerRef.value?.getBoundingClientRect();
    if (!rect) return;
    floatingStyle.value = {
      top: `${rect.bottom + offset}px`,
      ...(effectiveAlign === 'right'
        ? { right: `${window.innerWidth - rect.right}px` }
        : { left: `${rect.left}px` }),
    };
  };

  const openDropdown = () => {
    updatePosition();
    open.value = true;
  };

  const close = () => {
    open.value = false;
  };

  const toggle = () => {
    if (open.value) {
      close();
    } else {
      openDropdown();
    }
  };

  if (handleClickOutside) {
    const onDocMousedown = (e: MouseEvent) => {
      if (!triggerRef.value?.contains(e.target as Node)) {
        close();
      }
    };

    onMounted(() => document.addEventListener('mousedown', onDocMousedown));
    onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMousedown));
  }

  return { triggerRef, open, floatingStyle, updatePosition, openDropdown, close, toggle };
};
