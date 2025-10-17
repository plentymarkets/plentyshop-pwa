import type { UseScrollHandlerReturn, UseScrollHandlerState } from './types';

export const useScrollHandler: UseScrollHandlerReturn = (uuid:string) => {
  const state = useState<UseScrollHandlerState>(`useScrollHandler-${uuid}`, () => ({
    baselineTop: 0,
    baselineScrollY: 0,
    currentTop: 0,
    bottomValue: 0,
    attachScroll: () => {},
    detachScroll: () => {},
  }));

  let ticking = false;

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const handleScroll: HandleScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      console.log('ScrollY:', scrollY); // Debugging
      const delta = scrollY - state.value.baselineScrollY;
      const next = clamp(
        state.value.baselineTop + delta,
        state.value.baselineTop,
        state.value.baselineTop + state.value.bottomValue,
      );
      const rounded = Math.round(next);
      if (rounded !== state.value.currentTop) {
        state.value.currentTop = rounded;
        console.log('Updated currentTop:', state.value.currentTop); // Debugging
      }
      ticking = false;
    });
  }
};

const attachScroll: AttachScroll = () => {
  console.log('Attaching scroll listener for UUID:', uuid); // Debugging
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
