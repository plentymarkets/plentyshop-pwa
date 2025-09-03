import { describe, expect, it, vi } from 'vitest';
import { createDefaultFooterSettings } from '../useFooterSettings';

vi.mock('#app', () => ({
  useState: vi.fn(() => ({ value: null })),
  useAsyncData: vi.fn(),
  useI18n: () => ({
    t: (key: string) => key,
  }),
  readonly: (refValue: unknown) => refValue,
}));

vi.mock('~/composables/useSdk', () => ({
  useSdk: () => ({
    plentysystems: {
      getBlocks: vi.fn(),
    },
  }),
}));

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    'categories.legal.label': 'Legal',
    'categories.contact.label': 'Contact',
  };
  return translations[key] || key;
};

describe('useFooterSettings', () => {
  describe('createDefaultFooterSettings', () => {
    it('should return default footer settings with proper structure', () => {
      const defaults = createDefaultFooterSettings(mockT);

      expect(defaults).toHaveProperty('meta');
      expect(defaults).toHaveProperty('column1');
      expect(defaults).toHaveProperty('column2');
      expect(defaults).toHaveProperty('column3');
      expect(defaults).toHaveProperty('column4');
      expect(defaults).toHaveProperty('footnote');
      expect(defaults).toHaveProperty('footnoteAlign');
      expect(defaults).toHaveProperty('colors');

      expect(defaults.footnoteAlign).toBe('right');
      expect(defaults.column1.title).toBe('Legal');
      expect(defaults.column2.title).toBe('Contact');
      expect(defaults.column2.showContactLink).toBe(true);
    });

    it('should include current year in footnote', () => {
      const defaults = createDefaultFooterSettings(mockT);
      const currentYear = new Date().getFullYear();

      expect(defaults.footnote).toContain(currentYear.toString());
      expect(defaults.footnote).toContain('PlentyONE GmbH');
    });

    it('should have proper color defaults', () => {
      const defaults = createDefaultFooterSettings(mockT);

      expect(defaults.colors.background).toBe('#cfe4ec');
      expect(defaults.colors.text).toBe('#1c1c1c');
      expect(defaults.colors.footnoteBackground).toBe('#161a16');
      expect(defaults.colors.footnoteText).toBe('#959795');
    });
  });

  describe('extractFooterFromBlocks', () => {
    it('should extract footer settings from blocks JSON', async () => {
      const { useFooterSettings } = await import('../useFooterSettings');
      const { extractFooterFromBlocks } = useFooterSettings();

      const mockBlocks = JSON.stringify([
        { name: 'Header', content: { title: 'Header' } },
        {
          name: 'Footer',
          content: {
            column1: { title: 'Test Legal' },
            column2: { title: 'Test Contact' },
            footnote: 'Test footnote',
          },
        },
      ]);

      const result = extractFooterFromBlocks(mockBlocks);

      expect(result).toBeDefined();
      expect(result?.column1.title).toBe('Test Legal');
      expect(result?.column2.title).toBe('Test Contact');
      expect(result?.footnote).toBe('Test footnote');
    });

    it('should return null for invalid JSON', async () => {
      const { useFooterSettings } = await import('../useFooterSettings');
      const { extractFooterFromBlocks } = useFooterSettings();

      const result = extractFooterFromBlocks('invalid json');
      expect(result).toBeNull();
    });

    it('should return null when no footer block exists', async () => {
      const { useFooterSettings } = await import('../useFooterSettings');
      const { extractFooterFromBlocks } = useFooterSettings();

      const mockBlocks = JSON.stringify([
        { name: 'Header', content: { title: 'Header' } },
        { name: 'Banner', content: { title: 'Banner' } },
      ]);

      const result = extractFooterFromBlocks(mockBlocks);
      expect(result).toBeNull();
    });
  });
});
