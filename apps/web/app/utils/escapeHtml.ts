const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

/**
 * Escapes special HTML characters in a string to their HTML entity equivalents.
 * @param text - The string to escape.
 * @returns The escaped string safe for use in HTML content.
 */
export const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return '';
  return text.replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character] ?? character);
};
