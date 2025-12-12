export type HorizontalSpacingKey = 's' | 'm' | 'l';

const MAP: Record<HorizontalSpacingKey, string> = {
  s: 'max-w-screen-3xl',
  m: 'max-w-screen-2xl',
  l: 'max-w-screen-xl',
};

export const DEFAULT_HORIZONTAL_CLASS = 'max-w-screen-3xl';

export const getHorizontalClass = (key: string | undefined): string => {
  if (!key) return DEFAULT_HORIZONTAL_CLASS;
  return (MAP as Record<string, string>)[key] ?? DEFAULT_HORIZONTAL_CLASS;
};
