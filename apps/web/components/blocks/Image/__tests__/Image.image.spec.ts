import type { ImageProps } from '../types';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';

const imageBlockUuid = '45454545-4545-4455-8455-454545454545';

export const mockImageBlock: ImageProps = {
  name: 'Image',
  type: 'content',
  meta: { uuid: imageBlockUuid },
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
      linktarget: '',
    },
    text: {
      textOverlay: 'New test overlay',
      textOverlayColor: '#333333',
      textOverlayAlignY: 'center',
      textOverlayAlignX: 'center',
    },
    button: {
      label: 'New button',
      link: '/test-link',
      variant: 'primary',
    },
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: '#fff',
    },
  },
};

describe('Image block', () => {
  it('should render all image sources and attributes correctly', () => {
    const wrapper = mount(Image, {
      props: mockImageBlock,
    });

    expect(wrapper.html()).toContain(mockImageBlock.content.image.wideScreen);
    expect(wrapper.html()).toContain(mockImageBlock.content.image.desktop);
    expect(wrapper.html()).toContain(mockImageBlock.content.image.tablet);
    expect(wrapper.html()).toContain(mockImageBlock.content.image.mobile);

    const img = wrapper.find('img, [data-testid="image-block"]');
    expect(img.attributes('alt')).toBe(mockImageBlock.content.image.alt);

    expect(wrapper.props().content.image.imageAlignment).toBe('right');
    expect(wrapper.props().content.image.fillMode).toBe('fill');
    expect(wrapper.props().content.image.aspectRatio).toBe('16 / 9');
  });

  it('should wrap image in NuxtLink with correct props when linktarget is filled', () => {
    const blockWithLink = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: {
          ...mockImageBlock.content.image,
          src: '/img.jpg',
          alt: 'Test alt',
          linktarget: '/test-link',
        },
      },
    };

    const wrapper = mount(Image, {
      props: blockWithLink,
      global: {
        stubs: {
          NuxtLink: defineComponent({
            name: 'NuxtLink',
            inheritAttrs: false,
            props: { to: { type: [String, Object], required: false } },
            setup(props, { slots, attrs }) {
              return () => h('a', { 'data-testid': 'image-link', to: props.to, ...attrs }, slots.default?.());
            },
          }),
          NuxtImg: defineComponent({
            name: 'NuxtImg',
            inheritAttrs: false,
            setup(_, { attrs }) {
              return () => h('img', { 'data-testid': 'image-block', ...attrs });
            },
          }),
        },
      },
    });

    const link = wrapper.find('[data-testid="image-link"]');
    expect(link.exists()).toBe(true);
    expect(link.attributes('to')).toBe('/test-link');
    expect(link.attributes('aria-label')).toBe(blockWithLink.content.image.alt);

    const img = wrapper.find('[data-testid="image-block"]');
    expect(img.exists()).toBe(true);
    expect(img.attributes('alt')).toBe(blockWithLink.content.image.alt);
  });
});
