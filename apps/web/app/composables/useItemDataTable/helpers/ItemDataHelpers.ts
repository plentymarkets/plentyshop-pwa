import type { Product } from '@plentymarkets/shop-api';

export const getConditionName = (product: Product): string => {
  const condition = product.item.conditionApi ?? product.item.condition;
  const names = condition?.names;

  if (Array.isArray(names)) {
    return names[0]?.name ?? '';
  }
  return names?.name ?? '';
};

export const getManufacturingCountryName = (product: Product): string => {
  const country = product.item.producingCountry;
  if (!country) return '';

  const names = country.names;

  if (Array.isArray(names)) {
    const first = names[0];
    return first?.name ?? '';
  }

  if (names && typeof names === 'object' && 'name' in names) {
    const obj = names as { name?: string | null };
    return obj.name ?? '';
  }

  return country.name ?? country.isoCode2 ?? '';
};

export const formatWeight = (value: number | null | undefined): string => {
  if (value == null) return '';
  return `${value} g`;
};

export const formatDimensions = (
  lengthMM?: number | null,
  widthMM?: number | null,
  heightMM?: number | null,
): string => {
  const parts = [lengthMM, widthMM, heightMM].filter((v) => v != null) as number[];

  if (!parts.length) return '';
  return `${parts.join(' x ')} mm`;
};

export const getManufacturerName = (product: Product): string => {
  const manufacturerData = product.item.manufacturer;
  const m = Array.isArray(manufacturerData) ? manufacturerData[0] : manufacturerData;

  return m?.name || m?.externalName || '';
};

export const formatContent = (product: Product): string => {
  const content = product.unit?.content;
  const names = product.unit?.names;

  const getUnitName = (): string | undefined => {
    switch (true) {
      case Array.isArray(names):
        return names[0]?.name;

      case !!names && typeof names === 'object' && 'name' in names:
        return names.name ? String(names.name) : undefined;

      default:
        return undefined;
    }
  };

  const unitName = getUnitName();

  if (content == null && !unitName) return '';
  return [content ?? '', unitName ?? ''].join(' ').trim();
};

export const formatVariationProperties = (product: Product): string => {
  return (product.variationProperties ?? [])
    .flatMap((group) => group.properties ?? [])
    .map((prop) => {
      const value = prop.values?.value;
      if (!value) return '';

      const name = prop.names?.name ?? '';
      return name ? `${name}: ${value}` : value;
    })
    .filter((text): text is string => text !== '')
    .join('; ');
};

export const formatAgeRating = (
  t: (key: string, params?: object) => string,
  age: number | null | undefined,
): string => {
  if (age == null) return '';

  const a = Number(age);

  switch (a) {
    case 0:
      return t('single-item-age-restriction-none');
    case 50:
      return t('single-item-age-restriction-not-flagged');
    case 80:
      return t('single-item-age-restriction-not-required');
    default:
      if (a > 0 && a <= 18) {
        return t('single-item-age-restriction', { age: a });
      }
      return t('single-item-age-restriction-unknown');
  }
};
