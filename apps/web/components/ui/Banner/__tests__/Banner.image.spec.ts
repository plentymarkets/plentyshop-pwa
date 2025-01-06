import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import { UiBanner } from '#components';

describe('Banner image', () => {
  it('should not render an image if no image is provided', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
          },
        },

        index: 0,
      },
    });

    const image = wrapper.find('[data-testid="banner-image-0"]');

    console.log(image.html());

    expect(image.attributes('src')).toBe('');
    expect(image.attributes('alt')).toBe('');
    expect(image.attributes('style')).toBe(undefined);

    expect(wrapper.find('[data-testid="banner-overlay-0"]').exists()).toBe(true);
  });

  it('should set the given brightness', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          image: {
            lg: '/test-lg.jpg',
            md: '/test-md.jpg',
            sm: '/test-sm.jpg',
            xs: '/test-xs.jpg',
            alt: 'test alt text',
            brightness: 0.5,
          },
        },

        index: 0,
      },
    });

    const image = wrapper.find('[data-testid="banner-image-0"]');

    expect(image.attributes('style')).toContain('filter: brightness(0.5)');
  });
});
