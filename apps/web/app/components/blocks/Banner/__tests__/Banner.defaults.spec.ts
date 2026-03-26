import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { BlocksBanner } from '#components';

const bannerBlockUuid = '11111111-1111-4111-8111-111111111111';

const checkElementOrder = (
  elements: { attributes: (key: string) => string | undefined }[],
  expectedOrder: string[],
) => {
  elements.forEach((element, index) => {
    expect(element.attributes('data-testid')).toContain(expectedOrder[index]);
  });
};

describe('Banner', () => {
  describe('with default settings', () => {
    const wrapper = mount(BlocksBanner, {
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
          },
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            textAlignment: 'left',
            justify: 'top',
            align: 'left',
            background: true,
          },
          button: {
            label: 'Test button',
            link: '/test-link',
            variant: 'primary',
          },
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    it('should render', () => {
      expect(wrapper.html()).not.toBe(null);
    });

    it('should render all elements in the correct order', () => {
      const expectedOrder = [
        'image',
        'overlay',
        'content',
        'text-content',
        'text-html',
        `banner-button-${bannerBlockUuid}`,
      ];
      const elements = wrapper.findAll('[data-testid^="banner-"], [data-testid^="text-"]');
      checkElementOrder(elements, expectedOrder);
    });

    it('should have an image', () => {
      const image = wrapper.find(`[data-testid="banner-image-${bannerBlockUuid}"]`);
      expect(image.exists()).toBe(true);
      expect(image.attributes('src')).toBe('/test-desktop.jpg');
      expect(image.attributes('alt')).toBe('test alt text');
    });

    it('should have a content overlay', () => {
      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.exists()).toBe(true);
      expect(overlay.attributes('style')).toContain('text-align: left');
      expect(overlay.attributes('style')).toContain('justify-content: flex-start');
      expect(overlay.attributes('style')).toContain('align-items: flex-start');
    });

    it('should have a content area', () => {
      const content = wrapper.find(`[data-testid="banner-content-${bannerBlockUuid}"]`);
      expect(content.exists()).toBe(true);
    });

    it('should have a description', () => {
      const description = wrapper.find(`[data-testid="text-html"]`);
      expect(description.exists()).toBe(true);
      expect(description.text()).toContain('Test description');
    });

    it('should have a button', () => {
      const button = wrapper.find(`[data-testid="banner-button-${bannerBlockUuid}"]`);
      expect(button.exists()).toBe(true);
      expect(button.attributes('to')).toBe('/test-link');
      expect(button.attributes('class')).toContain('bg-primary-500');
    });
  });
});
