import enTranslations from '../editorTranslations.en.json';
import deTranslations from '../editorTranslations.de.json';

describe('editorTranslations', () => {
  it('should have the same keys in both en and de translations', () => {
    const enKeys = Object.keys(enTranslations).sort();
    const deKeys = Object.keys(deTranslations).sort();

    expect(enKeys).toEqual(deKeys);
  });

  it('should not have any empty translation values in en', () => {
    Object.entries(enTranslations).forEach(([key, value]) => {
      expect(value, `Translation for key "${key}" in en should not be empty`).toBeTruthy();
      expect(value.trim(), `Translation for key "${key}" in en should not be whitespace only`).not.toBe('');
    });
  });

  it('should not have any empty translation values in de', () => {
    Object.entries(deTranslations).forEach(([key, value]) => {
      expect(value, `Translation for key "${key}" in de should not be empty`).toBeTruthy();
      expect(value.trim(), `Translation for key "${key}" in de should not be whitespace only`).not.toBe('');
    });
  });

  it('should have consistent parameter insertion for en and de', () => {
    const extractParams = (text: string): string[] => {
      const matches = text.match(/\{[^}]+\}/g);
      return matches ? matches.sort() : [];
    };

    Object.keys(enTranslations).forEach((key) => {
      const enParams = extractParams(enTranslations[key as keyof typeof enTranslations]);
      const deParams = extractParams(deTranslations[key as keyof typeof deTranslations]);

      expect(
        enParams,
        `Parameters for key "${key}" should match between en and de. EN: ${enParams.join(', ')}, DE: ${deParams.join(', ')}`,
      ).toEqual(deParams);
    });
  });
});
