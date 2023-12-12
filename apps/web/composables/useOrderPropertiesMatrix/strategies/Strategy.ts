import { ProductPropertyDetails } from '@plentymarkets/shop-api/lib/types/api/product';

export interface Strategy {
  setOrderProperty(page: string, orderProperty: ProductPropertyDetails): void;
}
