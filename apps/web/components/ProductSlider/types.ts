import type { HTMLAttributes } from 'vue';
import type { ProductItemDocumentData } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type ProductSliderProps = {
  items?: ProductItemDocumentData[];
  wrapperClass?: HTMLAttributes['class'];
};
