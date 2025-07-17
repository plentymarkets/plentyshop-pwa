import type { Facet, FacetSearchCriteria } from '@plentymarkets/shop-api';
export interface UseCanonicalState {
  loading: boolean;
}

export type StaticPageMeta = () => void;
export type CategoriesPageMeta = (productsCatalog: Facet, facetsFromUrl: FacetSearchCriteria) => void;

export interface UseCanonical {
  loading: Readonly<Ref<boolean>>;
  setStaticPageMeta: StaticPageMeta;
  setCategoriesPageMeta: CategoriesPageMeta;
}

export type UseCanonicalReturn = () => UseCanonical;
