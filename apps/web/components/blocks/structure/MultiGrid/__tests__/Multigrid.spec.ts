import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MultiGrid from '../MultiGrid.vue';

const multiGridBlockUuid = '22222222-2222-4222-8222-222222222222';

const mockMultiGridProps = {
  name: 'MainGrid',
  type: 'multi-grid',
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
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    gap: 'M',
  },
  meta: {
    uuid: multiGridBlockUuid,
  },
};

export const mockMultiGridBlockWithContent = {
  name: 'MultiGrid',
  type: 'structure',
  meta: { uuid: '64893934-ce1b-461e-8263-da8df6753872' },
  configuration: {
    columnWidths: [6, 6],
  },
  content: [
    {
      name: 'Image',
      type: 'content',
      meta: { uuid: '45454545-4545-4455-8455-454545454545' },
      content: {
        image: {
          wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          alt: 'alt text',
          imageAlignment: 'right',
          fillMode: 'fill',
          aspectRatio: '16 / 9',
        },
        text: {
          textOverlay: '',
          textOverlayColor: '#333333',
          textOverlayAlignY: 'center',
          textOverlayAlignX: 'center',
        },
        button: {
          label: '',
          link: '',
          variant: 'primary',
        },
      },
    },
    {
      name: 'TextCard',
      type: 'content',
      meta: { uuid: '56565656-5656-4565-8565-565656565656' },
      content: {
        text: {
          htmlDescription: 'Text that supports HTML formatting',
          title: 'h2 heading',
          subtitle: 'subtitle',
          textAlignment: 'left',
          color: '#000',
        },
        button: {
          label: 'Button',
          link: '/',
          variant: 'primary',
        },
        layout: {
          backgroundColor: '#ffffff',
          paddingTop: '0',
          paddingBottom: '0',
          paddingLeft: '0',
          paddingRight: '0',
          keepTransparent: 'true',
        },
      },
    },
  ],
};

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

  it('renders no columns when content is empty', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        content: [],
      },
    });
    expect(wrapper.findAll('[data-testid="multi-grid-column"]').length).toBe(0);
  });

  it('applies the correct gap class', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        layout: { ...mockMultiGridProps.layout, gap: 'XL' },
      },
    });
    expect(wrapper.find('[data-testid="multi-grid-structure"]').classes()).toContain('md:gap-x-5');
  });

  it('renders dynamic block types (Image, TextCard) with realistic PlentyONE content', () => {
    const wrapper = mount(MultiGrid, {
      props: mockMultiGridBlockWithContent,
    });

    const cols = wrapper.findAll('[data-testid="multi-grid-column"]');
    expect(cols.length).toBe(2);
  });

  it('applies layout styles (margin, background color) to the grid container', () => {
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

  it('applies responsive grid classes', () => {
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

  it('renders no columns when content is empty', () => {
    const wrapper = mount(MultiGrid, {
      props: {
        ...mockMultiGridProps,
        content: [],
      },
    });
    expect(wrapper.findAll('[data-testid="multi-grid-column"]').length).toBe(0);
  });
});
