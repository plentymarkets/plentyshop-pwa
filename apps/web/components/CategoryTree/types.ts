import { CategoryTreeItem } from '@plentymarkets/shop-api';

export type CategoryTreeListItem = {
  name: string;
  count?: number;
  href: string;
};

export type CategoryTreeProps = {
  parent?: CategoryTreeListItem | null;
  categories: CategoryTreeItem[];
};

export type CategoryTreeItemType = {
  name: string;
  href: string;
  selected?: boolean;
  count?: number;
};
