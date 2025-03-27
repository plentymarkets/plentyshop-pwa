export interface Category {
  details: { name: string; nameUrl: string }[];
  children?: Category[];
}

export type Page = {
  name: string;
  id: number;
  path: string;
  children?: Page[];
  type?: string;
  parentCategoryId?: string;
  sitemap?: string;
  linklist?: string;
  right?: string;
  plentyId?: string;
  lang?: string;
  canonicalLink?: string;
  position?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
};

export type CategoryTree = {
  id: number;
  type: string;
  itemCount: CategoryTreeItemCount[];
  childCount: number;
  children?: CategoryTreeItem[];
  details: CategoryTreeItemDetails[];
  right?: string;
  parentCategoryId?: string;
  sitemap?: string;
  linklist?: string;
};
export interface CategoryTreeItemCount {
  count: string;
  categoryId: string;
  webstoreId: string;
  lang: string;
  createdAt: string;
  updatedAt: string;
  variationCount: string;
  customerClassId: string;
}
export type CategoryTreeItem = {
  id: number;
  type: string;
  itemCount: CategoryTreeItemCount[];
  childCount: number;
  children?: CategoryTreeItem[];
  details: CategoryTreeItemDetails[];
  right: string;
  parentCategoryId?: string;
  sitemap?: string;
  linklist?: string;
};
export type CategoryTreeItemDetails = {
  name: string;
  lang: string;
  nameUrl: string;
  metaTitle: string;
  imagePath: string | null;
  image2Path: string | null;
  canonicalLink?: string;
  position?: string;
  metaDescription?: string;
  metaKeywords?: string;
  metaRobots?: string;
};
