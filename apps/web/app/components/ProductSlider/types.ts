import type { Product } from '@plentymarkets/shop-api';

export type ProductSliderProps = {
  items?: Product[];
  wrapperClass?: string | Record<string, unknown> | unknown[];
};
