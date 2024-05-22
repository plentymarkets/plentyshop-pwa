import type { CategoryTreeItem } from '@plentymarkets/shop-api';

export interface UseMegaMenuState {
  isOpen: boolean;
  activeNode: number[];
  category: CategoryTreeItem | null;
}

export type OpenMegaMenu = () => void;
export type CloseMegaMenu = () => void;
export type SetCategory = (categoryTree: CategoryTreeItem[]) => void;

export interface UseMegaMenuMethods {
  isOpen: Readonly<Ref<UseMegaMenuState['isOpen']>>;
  activeNode: Ref<UseMegaMenuState['activeNode']>;
  category: Ref<UseMegaMenuState['category']>;
  open: OpenMegaMenu;
  close: CloseMegaMenu;
  setCategory: SetCategory;
}

export type UseMegaMenuReturn = () => UseMegaMenuMethods;
