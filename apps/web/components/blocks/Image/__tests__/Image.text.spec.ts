import type { ImageProps } from '../types';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';

const imageBlockUuid = '45454545-4545-4455-8455-454545454545';

const mockImageBlockWithLinkTarget: ImageProps = {
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
      linktarget: '/test-link',
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
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      backgroundColor: '#fff',
    },
  },
};

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

describe('Image block text ', () => {
  it('should render the image overlay link with correct linktarget and href', () => {
    const wrapper = mount(Image, { props: mockImageBlockWithLinkTarget });

    const overlayLink = wrapper.find('[data-testid="image-link"]');
    expect(overlayLink.exists()).toBe(true);

    expect(overlayLink.attributes('to')).toBe(mockImageBlockWithLinkTarget.content.image.linktarget);

    const anchor = overlayLink.find('a');
    if (anchor.exists()) {
      expect(anchor.attributes('href')).toBe(mockImageBlockWithLinkTarget.content.image.linktarget);
    }
  });

  it('should render the correct aria-label for the overlay link', () => {
    const wrapper = mount(Image, { props: mockImageBlockWithLinkTarget });
    const overlayLink = wrapper.find('[data-testid="image-link"]');
    expect(overlayLink.attributes('aria-label')).toBe(mockImageBlockWithLinkTarget.content.image.alt);
  });

  it('should render text overlay with correct color and alignment', () => {
    const wrapper = mount(Image, { props: mockImageBlock });

    const overlay = wrapper.find('[data-testid="image-overlay-text"]');

    expect(overlay.attributes('style')).toContain(`color: ${mockImageBlock.content.text.textOverlayColor}`);

    const classes = overlay.classes();
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-center');
    expect(classes).toContain('text-center');
  });

  it('should render overlay text when present', () => {
    const wrapper = mount(Image, { props: mockImageBlock });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.text()).toBe('New test overlay');
  });

  it('should apply default color if textOverlayColor is missing', () => {
    const block = {
      ...mockImageBlock,
      content: { ...mockImageBlock.content, text: { ...mockImageBlock.content.text, textOverlayColor: undefined } },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.attributes('style')).toContain('color:');
  });

  it('should apply correct vertical alignment', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        text: { ...mockImageBlock.content.text, textOverlayAlignY: 'top' as 'top' | 'center' | 'bottom' },
      },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.classes()).toContain('items-start');
  });

  it('should apply correct horizontal alignment', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        text: { ...mockImageBlock.content.text, textOverlayAlignX: 'right' as 'left' | 'center' | 'right' },
      },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.classes()).toContain('justify-end');
  });

  it('should handle long overlay text', () => {
    const longText = 'A'.repeat(500);
    const block = {
      ...mockImageBlock,
      content: { ...mockImageBlock.content, text: { ...mockImageBlock.content.text, textOverlay: longText } },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.text()).toBe(longText);
  });
});
