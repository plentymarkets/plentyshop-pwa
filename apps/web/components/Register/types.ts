import type { Order } from '@plentymarkets/shop-api';

export type RegisterFormParams = {
  isModal?: boolean;
  emailAddress?: string;
  order?: Order;
  changeableView?: boolean;
};
