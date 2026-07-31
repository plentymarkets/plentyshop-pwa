import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import MultiGrid from '../../../../../components/blocks/structure/MultiGrid/MultiGrid.vue';
import { multiGridBlockUuid, mockMultiGridProps } from './multiGrid.mock';

const { useViewportMock } = vi.hoisted(() => ({
  useViewportMock: vi.fn((): { isLessThan: (breakpoint: string) => boolean; breakpoint: { value: string } } => ({
    isLessThan: (_breakpoint: string) => false,
    breakpoint: { value: 'lg' },
  })),
}));

mockNuxtImport('useViewport', () => useViewportMock);

describe('MultiGrid block', () => {
  it('should render the correct number of columns (2)', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        layout: {
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: '#fff',
          gap: 'M',
        },
      },
    });
    const cols = wrapper.findAll('[data-testid="multi-grid-column"]');
    expect(cols.length).toBe(2);
  });

  it('should render the correct number of columns (3)', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        name: 'MultiGrid',
        type: 'structure',
        content: [
          {
            name: 'TextCard',
            type: 'text',
            content: { text: 'Test text' },
            meta: { uuid: '33333333-3333-4333-8333-333333333333' },
            parent_slot: 0,
          },
          {
            name: 'Image',
            type: 'image',
            content: { src: '/test.jpg', alt: 'Test image' },
            meta: { uuid: '44444444-4444-4444-8444-444444444444' },
            parent_slot: 1,
          },
          {
            name: 'TextCard',
            type: 'text',
            content: { text: 'Another text' },
            meta: { uuid: '55555555-5555-4555-8555-555555555555' },
            parent_slot: 2,
          },
        ],
        configuration: {
          columnWidths: [4, 4, 4],
        },
        layout: {
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: '#fff',
          gap: 'M',
        },
        meta: {
          uuid: multiGridBlockUuid,
        },
      },
    });
    const cols = wrapper.findAll('[data-testid="multi-grid-column"]');
    expect(cols.length).toBe(3);
  });

  it('should render no columns when content is empty', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        content: [],
      },
    });
    expect(wrapper.findAll('[data-testid="multi-grid-column"]').length).toBe(0);
  });

  it('should apply the correct gap class', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          ...mockMultiGridProps.configuration,
          layout: { ...mockMultiGridProps.configuration.layout, gap: 'XL' },
        },
      },
    });
    expect(wrapper.find('[data-testid="multi-grid-structure"]').classes()).toContain('@md:gap-x-5');
  });

  it('should apply layout styles (margin, background color) to the grid container', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          ...mockMultiGridProps.configuration,
          layout: {
            marginTop: 20,
            marginBottom: 10,
            backgroundColor: '#ABCDEF',
            gap: 'M',
          },
        },
      },
    });

    const grid = wrapper.find('[data-testid="multi-grid-structure"]');
    const style = grid.attributes('style');
    expect(style).toContain('background-color: #ABCDEF');
    expect(style).toContain('margin-top: 20px');
    expect(style).toContain('margin-bottom: 10px');
  });

  it('should apply responsive grid classes for a two-column grid', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          columnWidths: [6, 6],
        },
      },
    });

    const grid = wrapper.find('[data-testid="multi-grid-structure"]');
    const classes = grid.classes();
    expect(classes).toContain('@md:grid-cols-12');
    expect(classes).toContain('@lg:grid-cols-12');
  });

  it('should apply responsive grid classes for a three-column grid', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          columnWidths: [4, 4, 4],
        },
      },
    });

    const grid = wrapper.find('[data-testid="multi-grid-structure"]');
    const classes = grid.classes();
    expect(classes).toContain('@md:grid-cols-12');
    expect(classes).toContain('@lg:grid-cols-12');
  });

  it('should apply items-stretch when alignHeights is true', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          ...mockMultiGridProps.configuration,
          layout: { ...mockMultiGridProps.configuration.layout, alignHeights: true },
        },
      },
    });

    const classes = wrapper.find('[data-testid="multi-grid-structure"]').classes();
    expect(classes).toContain('items-stretch');
    expect(classes).not.toContain('items-start');
  });

  it('should apply items-start when alignHeights is false', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          ...mockMultiGridProps.configuration,
          layout: { ...mockMultiGridProps.configuration.layout, alignHeights: false },
        },
      },
    });

    const classes = wrapper.find('[data-testid="multi-grid-structure"]').classes();
    expect(classes).toContain('items-start');
    expect(classes).not.toContain('items-stretch');
  });

  it('should apply flex-col-reverse classes when reverseOnMobile is true', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          ...mockMultiGridProps.configuration,
          layout: { ...mockMultiGridProps.configuration.layout, reverseOnMobile: true },
        },
      },
    });

    const classes = wrapper.find('[data-testid="multi-grid-structure"]').classes();
    expect(classes).toContain('flex');
    expect(classes).toContain('flex-col-reverse');
    expect(classes).toContain('@md:grid');
    expect(classes).toContain('@md:grid-cols-12');
  });

  it('should not apply flex-col-reverse classes when reverseOnMobile is false or unset', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          ...mockMultiGridProps.configuration,
          layout: { ...mockMultiGridProps.configuration.layout, reverseOnMobile: false },
        },
      },
    });

    const classes = wrapper.find('[data-testid="multi-grid-structure"]').classes();
    expect(classes).not.toContain('flex-col-reverse');
  });

  it('should render a 2 columns multigrid with 2 blocks in the first column and 1 block in the second column', () => {
    const blocks = [
      { name: 'Text', type: 'text', content: { text: 'Test' }, meta: { uuid: 'a' }, parent_slot: 0 },
      {
        name: 'Image',
        type: 'image',
        content: { src: '/test.jpg', alt: 'Test image' },
        meta: { uuid: 'b' },
        parent_slot: 0,
      },
      { name: 'Text', type: 'text', content: { text: 'Test' }, meta: { uuid: 'c' }, parent_slot: 1 },
    ];

    const wrapper = mount(MultiGrid, {
      props: {
        name: 'MultiGrid',
        type: 'structure',
        content: blocks,
        configuration: { columnWidths: [6, 6] },
        layout: { marginTop: 0, marginBottom: 0, backgroundColor: '#fff', gap: 'M' },
        meta: { uuid: 'test-multigrid' },
      },
    });

    const columns = wrapper.findAll('[data-testid="multi-grid-column"]');
    expect(columns.length).toBe(2);
    if (!columns[0] || !columns[1]) {
      throw new Error('Expected two columns to be rendered');
    }

    expect(columns[0].findAll('.group\\/row').length).toBe(2);
    expect(columns[1].findAll('.group\\/row').length).toBe(1);

    const firstColBlocks = columns[0].findAll('.group\\/row');
    if (!firstColBlocks[0] || !firstColBlocks[1]) {
      throw new Error('Expected two blocks in the first column');
    }

    expect(firstColBlocks[0].attributes('data-uuid')).toBe('a');
    expect(firstColBlocks[1].attributes('data-uuid')).toBe('b');

    const secondColBlock = columns[1].find('.group\\/row');
    expect(secondColBlock.attributes('data-uuid')).toBe('c');
  });

  it('should apply col-span-12 to columns on mobile', () => {
    useViewportMock.mockReturnValue({
      isLessThan: (breakpoint: string) => breakpoint === 'md',
      breakpoint: { value: 'sm' },
    });

    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        configuration: {
          columnWidths: [6, 6],
        },
      },
    });

    const columns = wrapper.findAll('[data-testid="multi-grid-column"]');
    columns.forEach((column) => {
      expect(column.classes()).toContain('col-span-12');
    });

    useViewportMock.mockReturnValue({
      isLessThan: (_breakpoint: string) => false,
      breakpoint: { value: 'lg' },
    });
  });
});
