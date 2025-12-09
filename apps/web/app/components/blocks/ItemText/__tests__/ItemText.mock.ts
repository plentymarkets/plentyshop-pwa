import type { ItemTextProps } from '../types';

/**
 * Mock ItemText block for testing
 * Fully typed with ItemTextProps for type safety
 */
export const ItemTextMock: ItemTextProps = {
  name: 'ItemText',
  type: 'content',
  meta: {
    uuid: 'b1a2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c522',
  },
  content: {
    text: {
      title: 'Item details',
    },
    layout: {
      displayAsCollapsable: true,
      initiallyCollapsed: true,
      paddingTop: 10,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
};
