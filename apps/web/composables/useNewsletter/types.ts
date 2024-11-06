import type { NewsletterParams } from '@plentymarkets/shop-api';

export interface UseNewsletterState {
  loading: boolean;
  showNames: boolean;
  showNewsletter: boolean;
}

export type Subscribe = (params: NewsletterParams) => Promise<boolean>;

export interface UseNewsletter {
  loading: Readonly<Ref<boolean>>;
  showNames: Ref<boolean>;
  showNewsletter: Ref<boolean>;
  subscribe: Subscribe;
}

export type UseNewsletterReturn = () => UseNewsletter;
