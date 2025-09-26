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
  all: 'all',
  noindex: 'noindex',
  nofollow: 'nofollow',
  'noindex, nofollow': 'noindex, nofollow2',
  varProp: "Selection via variation property of the type 'Text'. Default value = 'all'",
};

export const seoRichSnippetBrands: Record<string, string> = {
  '1': 'Do not display',
  '2': 'External name of the brand',
  '3': 'Use brand name from variation property of the type text',
};

export const seoRichSnippetManufacturers: Record<string, string> = {
  '1': 'Do not display',
  '2': 'External name of the manufacturer',
  '3': 'Use brand name from variation property of the type text',
};

export const seoRichSnippetBarcodeGtins: Record<string, string> = {
  '1': 'Do not display',
  '2': 'Use first GTIN barcode from variation',
  '3': 'Use specific GTIN barcode by ID',
};

export const seoRichSnippetBarcodeGtin8s: Record<string, string> = {
  '1': 'Do not display',
  '2': 'Use first GTIN-8 barcode from variation',
  '3': 'Use specific GTIN-8 barcode by ID',
};

export const seoRichSnippetBarcodeGtin13s: Record<string, string> = {
  '1': 'Do not display',
  '2': 'Use first GTIN-13 barcode from variation',
  '3': 'Use specific GTIN-13 barcode by ID',
};

export const seoRichSnippetBarcodeIsbns: Record<string, string> = {
  '1': 'Do not display',
  '2': 'Use first ISBN barcode from variation',
  '3': 'Use specific ISBN barcode by ID',
};

export const seoRichSnippetMpnBarcodes: Record<string, string> = {
  '1': 'Do not display',
  '2': 'Show external variation ID',
  '3': 'Use MPN from variation property of the type text',
};

export const seoRichSnippetSkuBarcodes: Record<string, string> = {
  '1': 'Use variation ID',
  '2': 'Use variation number',
  '3': 'Use SKU from variation property',
  '4': 'Item ID',
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
