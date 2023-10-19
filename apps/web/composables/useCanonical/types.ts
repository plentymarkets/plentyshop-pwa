import type { Ref } from 'vue';

export interface UseCanonicalState {
  loading: boolean;
}

export type StaticPageMeta = () => void;
export type CategoriesPageMeta = (productsCatalog: any, facetsFromUrl: any) => void;

export interface UseCanonical {
  loading: Readonly<Ref<boolean>>;
  setStaticPageMeta: StaticPageMeta;
  setCategoriesPageMeta: CategoriesPageMeta;
}

export type UseCanonicalReturn = () => UseCanonical;
