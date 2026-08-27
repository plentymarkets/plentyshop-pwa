/**
 * Serializes a value to JSON for safe embedding inside a `<script type="application/ld+json">` tag.
 * Escapes `<` so a value containing `</script>` can't break out of the script tag.
 * @param value - The value to serialize.
 * @param space - Optional indentation, forwarded to `JSON.stringify`.
 * @returns The escaped JSON string.
 */
export const safeSerializeJsonLd = (value: unknown, space?: number): string =>
  JSON.stringify(value, null, space).replaceAll('<', String.raw`\u003C`);
