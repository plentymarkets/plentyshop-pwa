import type { Data } from '@plentymarkets/shop-api';

export type EmailConfirmationOptin = (newsletterEmailId: string, authString: string) => Promise<Data<boolean> | null>;

export interface UseNewsletterConfirmation {
  confirmEmail: EmailConfirmationOptin;
}

export type UseNewsletterConfirmationReturn = () => UseNewsletterConfirmation;
