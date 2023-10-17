import type { Ref } from 'vue';

export interface UseCanonicalState {
  loading: boolean;
}

export type StaticPageMeta = () => void;

export interface UseCanonical {
  loading: Readonly<Ref<boolean>>;
  setStaticPageMeta: StaticPageMeta;
}

export type UseCanonicalReturn = () => UseCanonical;
