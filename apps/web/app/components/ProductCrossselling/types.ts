import type { Product } from '@plentymarkets/shop-api';
export type CrossSellingRelation =
  | "Similar"
  | "Accessory"
  | "Bundle"
  | "ReplacementPart";

export type CrossSellingProps = {
  crossSellingRelation: CrossSellingRelation;
  product: Product;
  showTitle?: boolean;
  title?: string;
};
