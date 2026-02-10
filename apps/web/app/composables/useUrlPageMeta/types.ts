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

export interface UseUrlPageMeta {
  loading: Readonly<Ref<boolean>>;
  setStaticPageMeta: StaticPageMeta;
  setCategoriesPageMeta: CategoriesPageMeta;
}

export type UseUrlPageMetaReturn = () => UseUrlPageMeta;
