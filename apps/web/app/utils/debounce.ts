// We need any to avoid code duplication --- we have use cases for
// both `number` and `strings` in our codebase.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
};
