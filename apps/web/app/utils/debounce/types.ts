// We need any to avoid code duplication --- we have use cases for
// both `number` and `strings` in our codebase.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebouncedFn<T extends (...args: any[]) => void> = ((...args: Parameters<T>) => void) & {
  cancel: () => void;
};
