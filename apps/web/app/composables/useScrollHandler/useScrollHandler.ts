export const useScrollHandler = () => {
  const baselineTop = ref(0);
  const baselineScrollY = ref(0);
  const currentTop = ref(0);
  const bottomValue = ref(0);

  let ticking = false;

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

  const handleScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const delta = scrollY - baselineScrollY.value;
        const next = clamp(baselineTop.value + delta, baselineTop.value, baselineTop.value + bottomValue.value);
        const rounded = Math.round(next);
        if (rounded !== currentTop.value) {
          currentTop.value = rounded;
        }
        ticking = false;
      });
    }
  };

  const attachScroll = () => {
    baselineScrollY.value = typeof window !== 'undefined' ? window.scrollY : 0;
    currentTop.value = baselineTop.value;
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  };

  const detachScroll = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll);
    }
    currentTop.value = baselineTop.value;
  };

  return {
    baselineTop,
    baselineScrollY,
    currentTop,
    bottomValue,
    handleScroll,
    attachScroll,
    detachScroll,
  };
};
