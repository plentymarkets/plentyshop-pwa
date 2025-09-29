import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';

const imageBlockUuid = '45454545-4545-4455-8455-454545454545';

describe('Image block button', () => {
  it('should not render a button if no button is provided', () => {
    const wrapper = mount(Image, {
      props: {
        name: 'Image',
        type: 'content',
        content: {
          image: {
            wideScreen: '/img.jpg',
            desktop: '/img.jpg',
            tablet: '/img.jpg',
            mobile: '/img.jpg',
            alt: 'Test alt',
            imageAlignment: 'right',
            fillMode: 'fill',
            aspectRatio: '16 / 9',
          },
          text: {},
          button: {},
          layout: {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: '#fff',
          },
        },
        meta: { uuid: imageBlockUuid },
      },
    });

    expect(wrapper.find(`[data-testid="image-button-${imageBlockUuid}"]`).exists()).toBe(false);
  });

  it('should not render a button if no label is provided', () => {
    const wrapper = mount(Image, {
      props: {
        name: 'Image',
        type: 'content',
        content: {
          image: {
            wideScreen: '/img.jpg',
            desktop: '/img.jpg',
            tablet: '/img.jpg',
            mobile: '/img.jpg',
            alt: 'Test alt',
            imageAlignment: 'right',
            fillMode: 'fill',
            aspectRatio: '16 / 9',
          },
          text: {},
          button: {
            link: '/test-link',
          },
          layout: {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: '#fff',
          },
        },
        meta: { uuid: imageBlockUuid },
      },
    });

    expect(wrapper.find(`[data-testid="image-button-${imageBlockUuid}"]`).exists()).toBe(false);
  });

  it('should not render a button if no link is provided', () => {
    const wrapper = mount(Image, {
      props: {
        name: 'Image',
        type: 'content',
        content: {
          image: {
            wideScreen: '/img.jpg',
            desktop: '/img.jpg',
            tablet: '/img.jpg',
            mobile: '/img.jpg',
            alt: 'Test alt',
            imageAlignment: 'right',
            fillMode: 'fill',
            aspectRatio: '16 / 9',
          },
          text: {},
          button: {
            label: 'Test button',
          },
          layout: {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: '#fff',
          },
        },
        meta: { uuid: imageBlockUuid },
      },
    });

    expect(wrapper.find(`[data-testid="image-button-${imageBlockUuid}"]`).exists()).toBe(false);
  });
});
