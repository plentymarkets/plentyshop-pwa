import type { HTMLAttributes } from 'vue';
import type { Product } from '@plentymarkets/shop-api';

export type ProductSliderProps = {
  items?: Product[];
  wrapperClass?: HTMLAttributes['class'];
};
