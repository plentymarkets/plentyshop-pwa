import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MultiGrid from '../MultiGrid.vue';

const multiGridBlockUuid = '22222222-2222-4222-8222-222222222222';

describe('MultiGrid block', () => {
  it('should render the correct number of columns (2)', () => {
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
          },
          {
            name: 'Image',
            type: 'image',
            content: { src: '/test.jpg', alt: 'Test image' },
            meta: { uuid: '44444444-4444-4444-8444-444444444444' },
          },
        ],
        configuration: {
          columnWidths: [6, 6],
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
          },
          {
            name: 'Image',
            type: 'image',
            content: { src: '/test.jpg', alt: 'Test image' },
            meta: { uuid: '44444444-4444-4444-8444-444444444444' },
          },
        ],
        configuration: {
          columnWidths: [6, 6, 6],
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
    expect(cols.length).toBe(2);
  });

//   it('renders no columns when content is empty', () => {
//     const wrapper = mount(MultiGrid, {
//       props: {
//         ...mockMultiGridProps,
//         content: [],
//       },
//     });
//     expect(wrapper.findAll('[data-testid="multi-grid-column"]').length).toBe(0);
//   });

//   it('applies the correct gap class', () => {
//     const wrapper = mount(MultiGrid, {
//       props: {
//         ...mockMultiGridProps,
//         layout: { ...mockMultiGridProps.layout, gap: 'XL' },
//       },
//     });
//     expect(wrapper.find('[data-testid="multi-grid-structure"]').classes()).toContain('gap-x-5');
//   });

  //   it('should apply the given background color', () => {
  //     const wrapper = mount(MultiGrid, {
  //       props: {
  //         name: 'MultiGrid',
  //         type: 'multi-grid',
  //         content: [],
  //         configuration: {
  //           columnWidths: [12],
  //         },
  //         layout: {
  //           backgroundColor: '#ABCDEF',
  //         },
  //         meta: {
  //           uuid: multiGridBlockUuid,
  //         },
  //       },
  //     });

  //     const grid = wrapper.find('[data-testid="multi-grid-structure"]');
  //     expect(grid.attributes('style')).toContain('background-color: #ABCDEF');
  //   });
});
