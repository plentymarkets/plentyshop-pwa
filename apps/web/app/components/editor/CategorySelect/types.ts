import type { CategorySearchCriteria } from '@plentymarkets/shop-api';

export interface CategorySelectProps {
  modelValue: string | null;
  baseSearchParams: CategorySearchCriteria;
  dataTestId?: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}
