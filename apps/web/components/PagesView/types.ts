export interface MenuItemType {
  id: number;
  name: string;
  path: string;
  children?: MenuItemType[];
  type?: string;
}
