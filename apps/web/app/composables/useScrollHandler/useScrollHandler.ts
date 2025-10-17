import type { UseScrollHandlerReturn, UseScrollHandlerState } from './types';

export const useScrollHandler: UseScrollHandlerReturn = (
  uuid: string,
  itemGridHeight: Ref<number>,
  containsItemGrid: Ref<boolean>,
) => {
  const state = useState<UseScrollHandlerState>(`useScrollHandler-${uuid}`, () => ({
    baselineTop: 0,
    baselineScrollY: 0,
    currentTop: 0,
    bottomValue: 0,
  }));

  let ticking = false;

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

  const handleScroll: HandleScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const delta = scrollY - state.value.baselineScrollY;
        const next = clamp(
          state.value.baselineTop + delta,
          state.value.baselineTop,
          state.value.baselineTop + state.value.bottomValue,
        );
        const rounded = Math.round(next);
        if (rounded !== state.value.currentTop) {
          state.value.currentTop = rounded;
        }
        ticking = false;
      });
    }
  };

  const attachScroll: AttachScroll = () => {
    state.value.baselineScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    state.value.currentTop = state.value.baselineTop;
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  };

  const detachScroll: DetachScroll = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
    }
    state.value.currentTop = state.value.baselineTop;
  };

  watch(
    () => itemGridHeight.value,
    (newHeight) => {
      if (containsItemGrid.value && newHeight > 0) {
        const topValue = Math.min(newHeight * 0.05, 200);
        state.value.baselineTop = Math.round(topValue);
        const calculatedBottomValue = newHeight * 0.95;
        state.value.bottomValue = Math.round(calculatedBottomValue);
        state.value.baselineScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        state.value.currentTop = state.value.baselineTop;
      }
    },
    { immediate: true },
  );



  watch(
    () => containsItemGrid.value,
    (has) => {
      if (has) attachScroll();
      else detachScroll();
    },
    { immediate: true },
  );

  return {
    baselineTop: toRef(state.value, 'baselineTop'),
    baselineScrollY: toRef(state.value, 'baselineScrollY'),
    currentTop: toRef(state.value, 'currentTop'),
    bottomValue: toRef(state.value, 'bottomValue'),
    handleScroll,
    attachScroll,
    detachScroll,
  };
};
