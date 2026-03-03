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

export const getVerticalClass = (key: string | undefined): string => {
  switch (key ?? '') {
    case 's':
      return 'mb-s';
    case 'm':
      return 'mb-m';
    case 'l':
      return 'mb-l';
    case 'xl':
      return 'mb-xl';
    default:
      return '';
  }
};

export const getVerticalPixels = (key: string | undefined): number => {
  switch (key ?? '') {
    case 's':
      return 30;
    case 'm':
      return 40;
    case 'l':
      return 50;
    case 'xl':
      return 60;
    default:
      return 0;
  }
};
