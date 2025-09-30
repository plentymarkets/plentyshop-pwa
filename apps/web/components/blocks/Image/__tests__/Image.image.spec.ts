import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';
import { mockImageBlock } from './Image.mock';

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
          linktarget: '/test-link',
        },
      },
    };

    const wrapper = mount(Image, {
      props: blockWithLink,
      global: {
        stubs: {
          NuxtLink: {
            template: '<a data-testid="image-link" :to="to" :aria-label="ariaLabel"><slot /></a>',
            props: ['to', 'ariaLabel'],
          },
          NuxtImg: {
            template: '<img data-testid="image-block" v-bind="$attrs" />',
          },
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
