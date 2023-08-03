import type { HTMLAttributes } from 'vue';
import type { Product } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type ProductSliderProps = {
  items?: Product[];
  wrapperClass?: HTMLAttributes['class'];
};
