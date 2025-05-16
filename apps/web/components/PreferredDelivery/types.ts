import type { Packstation } from '@plentymarkets/shop-api';

export type PreferredOptionTypes = 'location' | 'neighbour';
export type PackstationProps = {
  station: Packstation;
  index: number;
  isActive: boolean;
  setRef: (el: Element | ComponentPublicInstance | null) => void;
};
