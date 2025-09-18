export type SettingOption = { label: string; value: string };

export const seoAvailabilities = [
  { key: 'availabilitiesOptions.availabilityNotSet', value: '' },
  { key: 'availabilitiesOptions.availabilityInStock', value: 'https://schema.org/InStock' },
  { key: 'availabilitiesOptions.availabilityOutOfStock', value: 'https://schema.org/OutOfStock' },
  { key: 'availabilitiesOptions.availabilityPreOrder', value: 'https://schema.org/PreOrder' },
  { key: 'availabilitiesOptions.availabilityDiscontinued', value: 'https://schema.org/Discontinued' },
  { key: 'availabilitiesOptions.availabilityInStoreOnly', value: 'https://schema.org/InStoreOnly' },
  { key: 'availabilitiesOptions.availabilityLimitedAvailability', value: 'https://schema.org/LimitedAvailability' },
  { key: 'availabilitiesOptions.availabilityOnlineOnly', value: 'https://schema.org/OnlineOnly' },
  { key: 'availabilitiesOptions.availabilityPreSale', value: 'https://schema.org/PreSale' },
  { key: 'availabilitiesOptions.availabilitySoldOut', value: 'https://schema.org/SoldOut' },
  { key: 'availabilitiesOptions.availabilityBackOrder', value: 'https://schema.org/BackOrder' },
];

export const cookieGroupOptions = [
  { key: 'cookieGroup.functional', value: 'CookieBar.functional.label' },
  { key: 'cookieGroup.externalMedia', value: 'CookieBar.externalMedia.label' },
  { key: 'cookieGroup.necessary', value: 'CookieBar.essentials.label' },
  { key: 'cookieGroup.marketing', value: 'CookieBar.marketing.label' },
];

export const conditionOptions = [
  'https://schema.org/NewCondition',
  'https://schema.org/UsedCondition',
  'https://schema.org/DamagedCondition',
  'https://schema.org/RefurbishedCondition',
];

export const robotsOptions = ['all', 'noindex', 'nofollow', 'noindex, nofollow'];

export const robotsItemOptions: Record<string, string> = {
  'all': 'all',
  'noindex': 'noindex',
  'nofollow': 'nofollow',
  'noindex, nofollow':'noindex, nofollow2',
  'varProp': "Selection via variation property of the type 'Text'. Default value = 'all'", 
};

export const sessionLifetimeOptions = [
  { key: 'sessionLifetime.untilBrowserClosed', value: '0' },
  { key: 'sessionLifetime.oneHour', value: '3600' },
  { key: 'sessionLifetime.oneDay', value: '86400' },
  { key: 'sessionLifetime.oneHundredDays', value: '8640000' },
];

export const getSeoAvailabilityOptions = (): SettingOption[] => {
  const locale = 'en';
  const { $i18n } = useNuxtApp();

  return seoAvailabilities.map((option) => ({
    label: $i18n.t(option.key, {}, { locale }) as string,
    value: option.value,
  }));
};

export const getCookieGroupOptions = (): SettingOption[] => {
  const locale = 'en';
  const { $i18n } = useNuxtApp();

  return cookieGroupOptions.map((option) => ({
    label: $i18n.t(option.key, {}, { locale }) as string,
    value: option.value,
  }));
};

export const getSessionLifetimeOptions = (): SettingOption[] => {
  const locale = 'en';
  const { $i18n } = useNuxtApp();

  return sessionLifetimeOptions.map((option) => ({
    label: $i18n.t(option.key, {}, { locale }) as string,
    value: option.value,
  }));
};
