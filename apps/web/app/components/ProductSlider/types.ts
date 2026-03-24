import SfScrollable from '@storefront-ui/vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { Product } from '@plentymarkets/shop-api';

export type ProductSliderProps = {
  items?: Product[];
  wrapperClass?: ComponentProps<typeof SfScrollable>['wrapperClass'];
};
