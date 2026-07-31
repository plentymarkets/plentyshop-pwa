import type { Facet, FacetSearchCriteria } from '@plentymarkets/shop-api';
export interface UseUrlPageMetaState {
  loading: boolean;
}

export type StaticPageMeta = () => void;
export type CategoriesPageMeta = (
  productsCatalog: Facet,
  facetsFromUrl: FacetSearchCriteria,
  canonicalOverride?: string,
) => void;
export type GetCategoryRobotsContent = (productsCatalog: Ref<Facet>) => ComputedRef<string>;

export interface UseUrlPageMeta {
  loading: Readonly<Ref<boolean>>;
  setStaticPageMeta: StaticPageMeta;
  setCategoriesPageMeta: CategoriesPageMeta;
  getCategoryRobotsContent: GetCategoryRobotsContent;
}

export type UseUrlPageMetaReturn = () => UseUrlPageMeta;
