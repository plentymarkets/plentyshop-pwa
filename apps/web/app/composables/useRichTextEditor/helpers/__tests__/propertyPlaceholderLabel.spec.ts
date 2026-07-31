import { formatPropertyPlaceholderLabel, getPropertyPlaceholderDisplayLabel } from '~/utils/propertyPlaceholders';

describe('propertyPlaceholderLabel', () => {
  describe('formatPropertyPlaceholderLabel', () => {
    it('should keep plain name tokens unchanged', () => {
      expect(formatPropertyPlaceholderLabel('Color')).toBe('Color');
    });

    it('should strip a single outer brace pair and format nested token paths', () => {
      expect(formatPropertyPlaceholderLabel('{group.value}')).toBe('group › value');
    });
  });

  describe('getPropertyPlaceholderDisplayLabel', () => {
    it('should prefer the stored label when available', () => {
      expect(getPropertyPlaceholderDisplayLabel('Color', 'Color')).toBe('Color');
    });

    it('should keep name tokens without braces when no label is stored', () => {
      expect(getPropertyPlaceholderDisplayLabel('Color')).toBe('Color');
    });

    it('should preserve double-braced value placeholders when no label is stored', () => {
      expect(getPropertyPlaceholderDisplayLabel('{{value}}')).toBe('{{value}}');
    });
  });
});
