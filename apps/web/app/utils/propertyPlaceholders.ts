import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';
import type { Product, VariationProperty } from '@plentymarkets/shop-api';
import type { PropertyPlaceholderKind } from '~/composables/useRichTextEditor/types';

const SINGLE_BRACE_WRAPPED_TOKEN_REGEX = /^\{([^{}]+)}$/;
const VALUE_TOKEN_WITH_ID_REGEX = /^\{\{value:(\d+)}}$/i;
const PROPERTY_PLACEHOLDER_TAG_REGEX = /(<span\b[^>]*data-property-token=(['"])(.*?)\2[^>]*>)([\s\S]*?)(<\/span>)/gi;
const HTML_BLOCK_IN_PARAGRAPH_REGEX = /<p([^>]*)>\s*<div data-rte-html-value>([\s\S]*)<\/div>\s*<\/p>/gi;

const matchesPropertyId = (property: VariationProperty, id: number): boolean => {
  return (
    property.id === id || property.names?.propertyId === id || property.names?.id === id || property.values?.id === id
  );
};

const findPropertyInGroups = (
  groups: Array<{ properties?: VariationProperty[] }> | undefined,
  id: number,
): VariationProperty | undefined => {
  return groups?.flatMap((group) => group.properties ?? []).find((property) => matchesPropertyId(property, id));
};

const getHtmlAttribute = (tag: string, attribute: string): string | null => {
  const match = tag.match(new RegExp(`${attribute}=(['"])(.*?)\\1`, 'i'));
  return match?.[2] ?? null;
};

const hasProductData = (product?: Product): product is Product => {
  return !!product && Object.keys(product).length > 0;
};

export const formatPropertyPlaceholderLabel = (token: string): string => {
  return token
    .replace(/^\{|}$/g, '')
    .split('.')
    .join(' › ');
};

export const getPropertyPlaceholderDisplayLabel = (token?: string | null, label?: string | null): string => {
  if (label?.trim()) {
    return label;
  }

  const normalizedToken = token?.trim() ?? '';
  const wrappedTokenMatch = normalizedToken.match(SINGLE_BRACE_WRAPPED_TOKEN_REGEX);

  if (wrappedTokenMatch?.[1]) {
    return wrappedTokenMatch[1];
  }

  return normalizedToken;
};

export const getPropertyById = (id: number, product: Product): VariationProperty | undefined => {
  const propertyGroups = productGetters.getPropertyGroups(product);

  if (propertyGroups?.length) {
    const propertyFromGroups = productPropertyGetters.getProperty(id, propertyGroups) as VariationProperty | undefined;

    if (propertyFromGroups) {
      return propertyFromGroups;
    }

    const fallbackFromGroups = findPropertyInGroups(propertyGroups as Array<{ properties?: VariationProperty[] }>, id);
    if (fallbackFromGroups) {
      return fallbackFromGroups;
    }
  }

  return findPropertyInGroups(product.variationProperties as Array<{ properties?: VariationProperty[] }>, id);
};

export const replacePropertyPlaceholdersInHtml = (html: string, product?: Product): string => {
  if (!html) {
    return '';
  }

  const withReplacedSpans = html.replace(PROPERTY_PLACEHOLDER_TAG_REGEX, (...groups) => {
    const [_match, openTag, _quote, token, _innerContent, closeTag] = groups;
    const label = getHtmlAttribute(openTag, 'data-property-label');
    const kind = getHtmlAttribute(openTag, 'data-property-kind') as PropertyPlaceholderKind | null;
    const cast = getHtmlAttribute(openTag, 'data-property-cast');
    const propertyIdAttribute = getHtmlAttribute(openTag, 'data-property-id');
    const propertyIdFromAttribute = propertyIdAttribute ? Number(propertyIdAttribute) : Number.NaN;
    const propertyIdFromToken = Number(token?.match(VALUE_TOKEN_WITH_ID_REGEX)?.[1]);
    const propertyId = Number.isFinite(propertyIdFromAttribute) ? propertyIdFromAttribute : propertyIdFromToken;
    const fallbackLabel = getPropertyPlaceholderDisplayLabel(token, label);

    if (kind === 'property-value' && Number.isFinite(propertyId) && hasProductData(product)) {
      const property = getPropertyById(propertyId, product);
      const rawValue = property ? (productPropertyGetters.getPropertyValue(property) ?? '') : fallbackLabel;

      if (cast === 'html') {
        return `<div data-rte-html-value>${decodeHtmlEntities(rawValue)}</div>`;
      }

      return `${openTag}${escapeHtml(rawValue)}${closeTag}`;
    }

    return `${openTag}${escapeHtml(fallbackLabel)}${closeTag}`;
  });

  return withReplacedSpans.replace(HTML_BLOCK_IN_PARAGRAPH_REGEX, '<div$1>$2</div>');
};
