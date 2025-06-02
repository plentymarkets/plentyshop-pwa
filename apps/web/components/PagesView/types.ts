import type { CategoryEntry } from '@plentymarkets/shop-api';

export interface PagesItemProps {
  item: CategoryEntry;
  parentId: number | undefined;
  icon?: Component;
  hideSettings?: boolean;
}
export interface MenuItemType {
  id: number;
  parentId?: number;
  name: string;
  path: string;
  children?: MenuItemType[];
  type?: string;
}
