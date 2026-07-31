import { getI18nPlaceholderDisplayLabel, getI18nPlaceholderTitle } from '../i18nPlaceholders';

describe('i18nPlaceholders', () => {
  it('should show only the last key segment as the display label', () => {
    expect(getI18nPlaceholderDisplayLabel('account.accountSettings.billingDetails.billingAddress')).toBe(
      'billingAddress',
    );
  });

  it('should keep the full key as the placeholder title', () => {
    expect(getI18nPlaceholderTitle('account.accountSettings.billingDetails.billingAddress')).toBe(
      'account.accountSettings.billingDetails.billingAddress',
    );
  });
});
