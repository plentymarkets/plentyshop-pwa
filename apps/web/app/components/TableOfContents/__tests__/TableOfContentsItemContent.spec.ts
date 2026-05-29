import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import TableOfContentsItemContent from '../TableOfContentsItemContent.vue';
import type { Block } from '@plentymarkets/shop-api';

const headerContainer = ref<Block | null>(null);
const hoveredUuid = ref('');

const { getEditorTranslationMock } = vi.hoisted(() => ({
  getEditorTranslationMock: vi.fn((key: string) => key),
}));

mockNuxtImport('useBlockManager', () => () => ({
  deleteBlock: vi.fn(),
  deleteBlockHard: vi.fn(),
  isGlobalBlock: vi.fn().mockReturnValue(false),
}));

mockNuxtImport('useBlocksVisibility', () => () => ({
  isBlockVisible: vi.fn().mockReturnValue(true),
  toggleBlockVisibility: vi.fn(),
}));

mockNuxtImport('useTableOfContents', () => () => ({
  hoveredUuid,
}));

mockNuxtImport('useBlocks', () => () => ({
  headerContainer,
}));

mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const createBlock = (uuid: string): Block => ({
  name: 'TextBlock',
  type: 'content',
  content: {},
  meta: { uuid },
});

const defaultProps = {
  uuid: 'content-uuid',
  blockName: 'TextBlock',
  label: 'Text Block',
  isSelected: false,
  block: createBlock('content-uuid'),
  isRoot: true,
};

describe('TableOfContentsItemContent', () => {
  describe('delete button visibility', () => {
    it('should show delete button for a non-header block even when header has only one child', () => {
      const headerBlock = createBlock('header-uuid');
      headerContainer.value = { ...createBlock('header-container'), content: [headerBlock] } as Block;

      const wrapper = mount(TableOfContentsItemContent, { props: defaultProps });

      expect(wrapper.find('[data-testid="toc-delete-content-uuid"]').exists()).toBe(true);
    });

    it('should hide delete button for the sole remaining header block', () => {
      const headerBlock = createBlock('header-uuid');
      headerContainer.value = { ...createBlock('header-container'), content: [headerBlock] } as Block;

      const wrapper = mount(TableOfContentsItemContent, {
        props: { ...defaultProps, uuid: 'header-uuid', block: headerBlock },
      });

      expect(wrapper.find('[data-testid="toc-delete-header-uuid"]').exists()).toBe(false);
    });

    it('should show delete button for a header block when header has multiple children', () => {
      const headerBlock1 = createBlock('header-uuid-1');
      const headerBlock2 = createBlock('header-uuid-2');
      headerContainer.value = {
        ...createBlock('header-container'),
        content: [headerBlock1, headerBlock2],
      } as Block;

      const wrapper = mount(TableOfContentsItemContent, {
        props: { ...defaultProps, uuid: 'header-uuid-1', block: headerBlock1 },
      });

      expect(wrapper.find('[data-testid="toc-delete-header-uuid-1"]').exists()).toBe(true);
    });
  });
});
