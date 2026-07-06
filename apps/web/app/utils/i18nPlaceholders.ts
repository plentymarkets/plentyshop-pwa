const I18N_PLACEHOLDER_TAG_REGEX = /(<span\b[^>]*data-i18n-key=(['"])(.*?)\2[^>]*>)([\s\S]*?)(<\/span>)/gi;

const getHtmlAttribute = (tag: string, attribute: string): string | null => {
  const match = new RegExp(String.raw`${attribute}=(['"])(.*?)\1`, 'i').exec(tag);
  return match?.[2] ?? null;
};

export const getI18nPlaceholderDisplayLabel = (key?: string | null, label?: string | null): string => {
  const displaySource = label?.trim() || key?.trim() || '';
  const keySegments = displaySource.split('.').filter(Boolean);

  return keySegments.at(-1) ?? displaySource;
};

export const getI18nPlaceholderTitle = (key?: string | null, label?: string | null): string => {
  return key?.trim() || label?.trim() || '';
};

export const replaceI18nPlaceholdersInHtml = (html: string, translate: (key: string) => string): string => {
  if (!html) {
    return '';
  }

  return html.replace(I18N_PLACEHOLDER_TAG_REGEX, (...groups) => {
    const [_match, openTag, _quote, key, _innerContent, closeTag] = groups;
    const label = getHtmlAttribute(openTag, 'data-i18n-label');
    const fallbackLabel = getI18nPlaceholderTitle(key, label);
    const translatedValue = key ? translate(key) : fallbackLabel;

    return `${openTag}${escapeHtml(translatedValue || fallbackLabel)}${closeTag}`;
  });
};
