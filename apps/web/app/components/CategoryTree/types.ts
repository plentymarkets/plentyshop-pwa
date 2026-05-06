import type { Category } from '@plentymarkets/shop-api';

export type CategoryTreeProps = {
  category: Category;
  basePath?: string;
};

export type CategoryTreeItemType = {
  name: string;
  href: string;
  selected?: boolean;
  count?: number;
};
