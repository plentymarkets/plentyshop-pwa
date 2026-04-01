// We need any to avoid code duplication --- we have use cases for
// both `number` and `strings` in our codebase.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebouncedFn<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
  cancel: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate: boolean = false,
): DebouncedFn<T> => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && timeout === null;
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced as DebouncedFn<T>;
};
