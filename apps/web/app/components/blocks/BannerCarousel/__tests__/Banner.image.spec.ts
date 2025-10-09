import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { BlocksBannerCarouselBanner } from '#components';

const bannerBlockUuid = '11111111-1111-4111-8111-111111111111';

describe('Banner image', () => {
  it('should not render an image if no image is provided', () => {
    const wrapper = mount(BlocksBannerCarouselBanner, {
      props: {
        name: 'Banner',
        type: 'content',
        content: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
          },
          image: {},
          button: {},
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    const image = wrapper.find(`[data-testid="banner-image-${bannerBlockUuid}"]`);

    expect(image.attributes('src')).toBe('');
    expect(image.attributes('alt')).toBe('');
    expect(image.attributes('style')).toContain('height: 576px');
    expect(wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`).exists()).toBe(true);
  });

  it('should set the given brightness', () => {
    const wrapper = mount(BlocksBannerCarouselBanner, {
      props: {
        name: 'Banner',
        type: 'content',
        content: {
          image: {
            wideScreen: '/test-desktop.jpg',
            desktop: '/test-desktop.jpg',
            tablet: '/test-tablet.jpg',
            mobile: '/test-mobile.jpg',
            alt: 'test alt text',
            brightness: 0.5,
          },
          text: {},
          button: {},
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    const image = wrapper.find(`[data-testid="banner-image-${bannerBlockUuid}"]`);
    expect(image.attributes('style')).toContain('filter: brightness(0.5)');
  });
});
