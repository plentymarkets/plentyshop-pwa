import { CategoryTreeItem } from '@plentymarkets/shop-api';

export type CategoryTreeProps = {
  categories?: CategoryTreeItem[];
};

export type CategoryTreeItemType = {
  name: string;
  href: string;
  selected?: boolean;
  count?: number;
};
