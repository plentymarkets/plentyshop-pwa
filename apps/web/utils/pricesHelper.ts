import type { Product } from '@plentymarkets/shop-api';

export const getPrice = (product: Product): number | null => {
  return product?.prices?.default?.unitPrice?.value ?? null;
};

export const getCrossedPrice = (product: Product): number | null => {
  return product?.prices?.rrp?.price?.value ?? null;
};

export const getSpecialOffer = (product: Product): number | null => {
  return product?.prices?.specialOffer?.price?.value ?? null;
};
