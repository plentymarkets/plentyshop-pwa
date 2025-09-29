import type { ImageProps } from '../types';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';

const imageBlockUuid = '45454545-4545-4455-8455-454545454545';

const mockImageBlock: ImageProps = {
  name: 'Image',
  type: 'content',
  meta: { uuid: imageBlockUuid },
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
    text: {
      textOverlay: '',
      textOverlayColor: '',
      textOverlayAlignY: 'center',
      textOverlayAlignX: 'center',
    },
    button: {
      label: '',
      link: '',
      variant: 'primary',
    },
    layout: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingLeft: 30,
      paddingRight: 40,
      backgroundColor: '#abc123',
    },
  },
};

describe('Image block layout', () => {
  it('should apply layout styles (padding, background color) to the image itself', () => {
    const wrapper = mount(Image, {
      props: mockImageBlock,
    });
    const img = wrapper.find('[data-testid="image-block"]');
    const style = img.attributes('style');
    expect(style).toContain('padding: 10px 40px 20px 30px;');
    expect(style).toContain('background-color: #abc123;');
  });
});
