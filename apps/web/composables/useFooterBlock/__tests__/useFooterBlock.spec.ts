import { describe, expect, it, vi } from 'vitest';
import { useFooterBlock } from '../useFooterBlock';
import type { FooterSettings } from '~/components/blocks/Footer/types';

// Mock the useFooterSettings composable
vi.mock('~/composables/useFooterSettings', () => ({
  useFooterSettings: () => ({
    getFooterSettings: vi.fn().mockReturnValue({
      meta: { uuid: 'default', isGlobalTemplate: true },
      column1: { title: 'Default Legal' },
      column2: { title: 'Default Contact', showContactLink: true },
      column3: { title: '' },
      column4: { title: '' },
      footnote: 'Default footnote',
      footnoteAlign: 'right',
      colors: {
        background: '#cfe4ec',
        text: '#1c1c1c',
        footnoteBackground: '#161a16',
        footnoteText: '#959795',
      },
    }),
    footerCache: { value: null },
  }),
}));

describe('useFooterBlock', () => {
  it('should return provided content when content prop is given', () => {
    const mockContent: FooterSettings = {
      meta: { uuid: 'prop-content', isGlobalTemplate: false },
      column1: { title: 'Prop Legal' },
      column2: { title: 'Prop Contact', showContactLink: false },
      column3: { title: 'Prop Col 3' },
      column4: { title: 'Prop Col 4' },
      footnote: 'Prop footnote',
      footnoteAlign: 'center',
      colors: {
        background: '#111',
        text: '#eee',
        footnoteBackground: '#222',
        footnoteText: '#ddd',
      },
    };

    const { resolvedContent } = useFooterBlock(mockContent);

    expect(resolvedContent.value).toEqual(mockContent);
  });

  it('should return footer cache reference', () => {
    const { cachedFooter } = useFooterBlock();

    expect(cachedFooter).toBeDefined();
    expect(cachedFooter.value).toBeNull();
  });
});
