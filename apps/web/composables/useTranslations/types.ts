export interface UseTranslationsState {
  data: string;
  loading: boolean;
}

export type FetchTranslations = (locale: string) => Promise<void>;

export interface UseTranslations {
  data: Readonly<Ref<UseTranslationsState['data']>>;
  loading: Readonly<Ref<UseTranslationsState['loading']>>;
  fetchTranslations: FetchTranslations;
}

export type UseTranslationsReturn = () => UseTranslations;
