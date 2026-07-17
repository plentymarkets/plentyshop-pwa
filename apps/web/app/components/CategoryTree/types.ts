import type { Category, CategoryBreadcrumb } from '@plentymarkets/shop-api';

export type CategoryTreeProps = {
  category: Category;
  breadcrumbs?: CategoryBreadcrumb[];
};

export type CategoryTreeItemType = {
  name: string;
  href: string;
  selected?: boolean;
  count?: number;
};
