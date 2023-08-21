import { CategoryTreeItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

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
