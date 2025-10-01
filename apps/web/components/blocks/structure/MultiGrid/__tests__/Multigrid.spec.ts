import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MultiGrid from '../MultiGrid.vue';
import { multiGridBlockUuid, mockMultiGridProps } from './multiGrid.mock';

describe('MultiGrid block', () => {
  it('should render the correct number of columns (2)', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        layout: {
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 5,
          marginRight: 5,
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
          marginLeft: 5,
          marginRight: 5,
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
        layout: { ...mockMultiGridProps.layout, gap: 'XL' },
      },
    });
    expect(wrapper.find('[data-testid="multi-grid-structure"]').classes()).toContain('md:gap-x-5');
  });

  it('should apply layout styles (margin, background color) to the grid container', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        layout: {
          marginTop: 20,
          marginBottom: 10,
          marginLeft: 5,
          marginRight: 15,
          backgroundColor: '#ABCDEF',
          gap: 'M',
        },
      },
    });

    const grid = wrapper.find('[data-testid="multi-grid-structure"]');
    const style = grid.attributes('style');
    expect(style).toContain('background-color: #ABCDEF');
    expect(style).toContain('margin: 20px 15px 10px 5px');
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
    expect(classes).toContain('md:grid-cols-2');
    expect(classes).toContain('lg:grid-cols-2');
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
    expect(classes).toContain('md:grid-cols-2');
    expect(classes).toContain('lg:grid-cols-3');
  });
});
