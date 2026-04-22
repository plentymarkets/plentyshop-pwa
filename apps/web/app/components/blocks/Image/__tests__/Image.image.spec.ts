import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import Image from '../../../../components/blocks/Image/Image.vue';
import { mockImageBlock } from './Image.mock';
import type { ImageProps } from '../types';

const getBlockDepthMock = vi.hoisted(() => vi.fn().mockReturnValue(-1));

mockNuxtImport('useBlockManager', () => () => ({
  getBlockDepth: getBlockDepthMock,
}));

describe('Image block', () => {
  it('should render the image with correct alt text and visual attributes', () => {
    const wrapper = mount(Image, {
      props: mockImageBlock,
    });

    expect(wrapper.html()).toContain(mockImageBlock.content.image.wideScreen);
    expect(wrapper.html()).toContain(mockImageBlock.content.image.desktop);
    expect(wrapper.html()).toContain(mockImageBlock.content.image.tablet);
    expect(wrapper.html()).toContain(mockImageBlock.content.image.mobile);

    const img = wrapper.find('img, [data-testid="image-block-image"]');
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
            template: '<img data-testid="image-block-image" v-bind="$attrs" />',
          },
        },
      },
    });

    const link = wrapper.find('[data-testid="image-link"]');
    expect(link.exists()).toBe(true);
    expect(link.attributes('to')).toBe('/test-link');
    expect(link.attributes('aria-label')).toBe(blockWithLink.content.image.alt);

    const img = wrapper.find('[data-testid="image-block-image"]');
    expect(img.exists()).toBe(true);
    expect(img.attributes('alt')).toBe(blockWithLink.content.image.alt);
  });

  it('should wrap image in a div (not NuxtLink) when linktarget is missing or empty', () => {
    const blockWithoutLink = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: {
          ...mockImageBlock.content.image,
          linktarget: '',
        },
      },
    };
    const wrapper = mount(Image, {
      props: blockWithoutLink,
      global: {
        stubs: {
          NuxtLink: {
            template: '<a data-testid="image-link" :to="to" :aria-label="ariaLabel"><slot /></a>',
            props: ['to', 'ariaLabel'],
          },
          NuxtImg: {
            template: '<img data-testid="image-block-image" v-bind="$attrs" />',
          },
        },
      },
    });
    const wrapperEl = wrapper.find('[data-testid="image-link"]');
    expect(wrapperEl.exists()).toBe(true);
    expect(wrapperEl.element.tagName.toLowerCase()).toBe('div');
    expect(wrapperEl.attributes('to')).toBeUndefined();
    expect(wrapperEl.classes()).not.toContain('absolute');
    const img = wrapper.find('[data-testid="image-block-image"]');
    expect(img.exists()).toBe(true);
  });

  it('should pass external URLs directly to the link without path transformation', () => {
    const externalUrl = 'https://www.example.com/products';
    const blockWithExternalLink = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: {
          ...mockImageBlock.content.image,
          linktarget: externalUrl,
        },
      },
    };

    const wrapper = mount(Image, {
      props: blockWithExternalLink,
      global: {
        stubs: {
          NuxtLink: {
            template: '<a data-testid="image-link" :to="to" :aria-label="ariaLabel"><slot /></a>',
            props: ['to', 'ariaLabel'],
          },
          NuxtImg: {
            template: '<img data-testid="image-block-image" v-bind="$attrs" />',
          },
        },
      },
    });

    const link = wrapper.find('[data-testid="image-link"]');
    expect(link.exists()).toBe(true);
    expect(link.element.tagName.toLowerCase()).toBe('a');
    expect(link.attributes('to')).toBe(externalUrl);
  });

  it('should open external links in a new tab with rel noopener', () => {
    const externalUrl = 'https://www.example.com/products';
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: { ...mockImageBlock.content.image, linktarget: externalUrl },
      },
    };
    const wrapper = mount(Image, {
      props: block,
      global: {
        stubs: {
          NuxtLink: {
            inheritAttrs: false,
            template: '<a data-testid="image-link" v-bind="$attrs"><slot /></a>',
          },
          NuxtImg: {
            template: '<img data-testid="image-block-image" v-bind="$attrs" />',
          },
        },
      },
    });
    const link = wrapper.find('[data-testid="image-link"]');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });

  it('should not render the image when content.image is absent', () => {
    const { image, ...contentWithoutImage } = mockImageBlock.content;
    const block = {
      ...mockImageBlock,
      content: contentWithoutImage as ImageProps['content'],
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-link"]').exists()).toBe(false);
  });

  it('should use a default aria-label when alt text is empty', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: { ...mockImageBlock.content.image, alt: '', linktarget: '/test' },
      },
    };
    const wrapper = mount(Image, {
      props: block,
      global: {
        stubs: {
          NuxtLink: {
            inheritAttrs: false,
            template: '<a data-testid="image-link" v-bind="$attrs"><slot /></a>',
          },
          NuxtImg: {
            template: '<img data-testid="image-block-image" v-bind="$attrs" />',
          },
        },
      },
    });
    expect(wrapper.find('[data-testid="image-link"]').attributes('aria-label')).toBe('Image link');
  });

  it('should apply brightness filter when brightness is set', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: { ...mockImageBlock.content.image, brightness: 0.5 },
      },
    };
    const wrapper = mount(Image, { props: block });
    const img = wrapper.find('[data-testid="image-block-image"]');
    expect(img.attributes('style')).toContain('brightness(0.5)');
  });

  it('should use object-contain styling when fill mode is fit', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: { ...mockImageBlock.content.image, fillMode: 'fit' as 'fit' | 'fill' },
      },
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-block-image"]').classes()).toContain('object-contain');
  });

  it('should use a fixed height when nested inside another block', () => {
    getBlockDepthMock.mockReturnValueOnce(1);
    const wrapper = mount(Image, { props: mockImageBlock });
    expect(wrapper.find('[data-testid="image-block"]').attributes('style')).toContain('height: 24rem');
  });

  it('should allow overlay content to receive clicks when a link target is set', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: { ...mockImageBlock.content.image, linktarget: 'https://example.com' },
      },
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-overlay-wrapper"]').classes()).toContain('pointer-events-none');
  });

  it('should not block overlay clicks when no link target is set', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: { ...mockImageBlock.content.image, linktarget: '' },
      },
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-overlay-wrapper"]').classes()).not.toContain('pointer-events-none');
  });
});
