export interface MenuItemType {
  id: number;
  parentId?: number;
  name: string;
  path: string;
  children?: MenuItemType[];
  type?: string;
}
