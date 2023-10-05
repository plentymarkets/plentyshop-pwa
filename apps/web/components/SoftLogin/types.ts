import type { GetOrderError } from '@plentymarkets/shop-api';

export type SoftLoginProps = {
  error: GetOrderError;
};

export type SoftLoginInput = {
  postcode?: string;
  fullName?: string;
};
