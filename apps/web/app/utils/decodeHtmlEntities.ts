export const decodeHtmlEntities = (value?: string): string => {
  if (!value) return '';

  if (
    !value.includes('&lt;') &&
    !value.includes('&gt;') &&
    !value.includes('&amp;') &&
    !value.includes('&quot;') &&
    !value.includes('&#039;')
  ) {
    return value;
  }

  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
};
