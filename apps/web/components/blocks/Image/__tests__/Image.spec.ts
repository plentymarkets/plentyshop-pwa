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
  it('renders all image sources and attributes correctly', () => {
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

  it('renders text overlay with correct color and alignment', () => {
    const wrapper = mount(Image, { props: mockImageBlock });

    const overlay = wrapper.find('[data-testid="image-overlay-text"]');

    expect(overlay.attributes('style')).toContain(`color: ${mockImageBlock.content.text.textOverlayColor}`);

    const classes = overlay.classes();
    expect(classes).toContain('items-center'); 
    expect(classes).toContain('justify-center');
    expect(classes).toContain('text-center'); 
  });






});
