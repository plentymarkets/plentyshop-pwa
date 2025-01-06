import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import { UiBanner } from '#components';

describe('Banner', () => {
  describe('with default settings', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          image: {
            lg: '/test-lg.jpg',
            md: '/test-md.jpg',
            sm: '/test-sm.jpg',
            xs: '/test-xs.jpg',
            alt: 'test alt text',
            brightness: 80,
          },
          text: {
            color: '#000000',
            bgcolor: '#ffffff',
            bgopacity: 0.5,
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            textAlignment: 'center',
            justify: 'center',
            align: 'center',
          },
          button: {
            label: 'Test button',
            link: '/test-link',
            variant: 'primary',
          },
        },

        index: 0,
      },
    });

    it('should render', () => {
      expect(wrapper.html()).not.toBe(null);
    });

    it('should have an image', () => {
      const image = wrapper.find('[data-testid="banner-image-0"]');

      expect(image.exists()).toBe(true);
      expect(image.attributes('src')).toBe('/test-lg.jpg');
      expect(image.attributes('alt')).toBe('test alt text');
      expect(image.attributes('style')).toContain('filter: brightness(80)');
    });

    it('should have a content overlay', () => {
      const overlay = wrapper.find('[data-testid="banner-overlay-0"]');

      expect(overlay.exists()).toBe(true);
      expect(overlay.attributes('style')).toContain('color: #000000');
      expect(overlay.attributes('style')).toContain('text-align: center');
      expect(overlay.attributes('style')).toContain('justify-content: center');
      expect(overlay.attributes('style')).toContain('align-items: center');
    });

    it('should have a content area', () => {
      const content = wrapper.find('[data-testid="banner-content-0"]');

      expect(content.exists()).toBe(true);
      expect(content.attributes('style')).toContain('background-color: #ffffff');
      expect(content.attributes('style')).toContain('opacity: 0.5');
    });

    it('should have a pretitle', () => {
      const pretitle = wrapper.find('[data-testid="banner-pretitle-0"]');

      expect(pretitle.exists()).toBe(true);
      expect(pretitle.text()).toBe('Test pretitle');
    });

    it('should have a title', () => {
      const title = wrapper.find('[data-testid="banner-title-0"]');

      expect(title.exists()).toBe(true);
      expect(title.text()).toBe('Test title');
    });

    it('should have a subtitle', () => {
      const subtitle = wrapper.find('[data-testid="banner-subtitle-0"]');

      expect(subtitle.exists()).toBe(true);
      expect(subtitle.text()).toBe('Test subtitle');
    });

    it('should have a description', () => {
      const description = wrapper.find('[data-testid="banner-description-0"]');

      expect(description.exists()).toBe(true);
      expect(description.text()).toBe('Test description');
      expect(description.html()).toContain('<p>Test description</p>');
    });

    it('should have a button', () => {
      const button = wrapper.find('[data-testid="banner-button-0"]');

      expect(button.exists()).toBe(true);
      expect(button.attributes('to')).toBe('/test-link');
      expect(button.attributes('class')).toContain('bg-primary-500');
    });
  });
});
