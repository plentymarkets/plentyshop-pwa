import { CategoryTreeItem } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

export type CategoryTreeProps = {
  categories?: CategoryTreeItem[];
};

export type CategoryTreeItemType = {
  name: string;
  href: string;
  selected?: boolean;
  count?: number;
};
