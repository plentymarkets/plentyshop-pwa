import type { HTMLAttributes } from 'vue';
import type { ProductItemDocumentData } from '../../../../../plentymarkets-sdk/packages/api-client';

export type ProductSliderProps = {
  items?: ProductItemDocumentData[];
  wrapperClass?: HTMLAttributes['class'];
};
