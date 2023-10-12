import type { Ref } from 'vue';

export interface UseCanonicalState {
  loading: boolean;
}

export interface UseCanonical {
  loading: Readonly<Ref<boolean>>;
}

export type UseCanonicalReturn = (url: string) => UseCanonical;
