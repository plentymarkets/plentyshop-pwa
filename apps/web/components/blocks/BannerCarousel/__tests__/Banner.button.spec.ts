import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { BlocksBannerCarouselBanner } from '#components';

const bannerBlockUuid = '11111111-1111-4111-8111-111111111111';

describe('Banner button', () => {
  it('should not render a button if no button is provided', () => {
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

    expect(wrapper.find(`[data-testid="banner-button-${bannerBlockUuid}"]`).exists()).toBe(false);
  });

  it('should not render a button if no label is provided', () => {
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
          button: {
            link: '/test-link',
          },
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    expect(wrapper.find(`[data-testid="banner-button-${bannerBlockUuid}"]`).exists()).toBe(false);
  });

  it('should not render a button if no link is provided', () => {
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
          button: {
            label: 'Test button',
          },
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    expect(wrapper.find(`[data-testid="banner-button-${bannerBlockUuid}"]`).exists()).toBe(false);
  });

  it('should set the given button variant', () => {
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
          button: {
            label: 'Test button',
            link: '/test-link',
            variant: 'secondary',
          },
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    const button = wrapper.find(`[data-testid="banner-button-${bannerBlockUuid}"]`);

    expect(button.attributes('class')).toContain('text-primary-500');
  });
});
