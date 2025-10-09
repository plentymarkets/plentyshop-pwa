import type { Category } from '@plentymarkets/shop-api';

export type CategoryTreeProps = {
  category: Category;
};

export type CategoryTreeItemType = {
  name: string;
  href: string;
  selected?: boolean;
  count?: number;
};
