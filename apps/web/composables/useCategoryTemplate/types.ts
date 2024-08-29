import type { CategoryTemplate, PayPalConfigResponse, PayPalCreateOrder } from '@plentymarkets/shop-api';

export interface UseCategoryTemplateState {
  data: CategoryTemplate | null;
  loading: boolean;
}

export interface UseCategoryTemplate {
  data: Readonly<Ref<CategoryTemplate['data']>>;
  loading: Readonly<Ref<boolean>>;
}

export type UseCategoryTemplateReturn = () => UseCategoryTemplate;
