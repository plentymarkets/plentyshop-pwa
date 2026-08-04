import type { NewsletterParams } from '@plentymarkets/shop-api';

export interface UseNewsletterState {
  loading: boolean;
}

export type Subscribe = (params: NewsletterParams) => Promise<boolean>;
export type Unsubscribe = (params: Pick<NewsletterParams, 'email'>) => Promise<boolean>;

export interface UseNewsletter {
  loading: Readonly<Ref<boolean>>;
  subscribe: Subscribe;
  unsubscribe: Unsubscribe;
}

export type UseNewsletterReturn = () => UseNewsletter;
