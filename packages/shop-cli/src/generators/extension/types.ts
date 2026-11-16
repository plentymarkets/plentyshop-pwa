export type SubscriptionInterval = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export type ExtensionPricing = 'free' | 'paid' | 'subscription';

/** The texts of an extension that appear throughout its files. */
export interface ExtensionTexts {
  /** Scoped package name, e.g. `@my-company/four-seasons` */
  name: string;
  displayNameEn: string;
  displayNameDe: string;
  descriptionEn: string;
  descriptionDe: string;
  supportEmail: string;
}

export interface ExtensionAnswers extends ExtensionTexts {
  pricing: ExtensionPricing;
  /** One-time price for `paid` extensions */
  price?: number;
  /** Price per selected interval for `subscription` extensions */
  subscriptionPrices?: Partial<Record<SubscriptionInterval, number>>;
}

export interface ExtensionFile {
  /** Path relative to the extension directory */
  path: string;
  content: string | Buffer;
}
