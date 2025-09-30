import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Image from '../Image.vue';
import { mockImageBlock } from './Image.mock';

describe('Image block text', () => {
  it('should render the image overlay link with correct linktarget and href', () => {
    const blockWithLinkTarget = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: {
          ...mockImageBlock.content.image,
          linktarget: '/test-link',
        },
        text: {
          ...mockImageBlock.content.text,
          textOverlay: '',
        },
        button: {
          ...mockImageBlock.content.button,
          label: '',
          link: '',
        },
      },
    };
    const wrapper = mount(Image, { props: blockWithLinkTarget });
    const overlayLink = wrapper.find('[data-testid="image-link"]');
    expect(overlayLink.exists()).toBe(true);
    expect(overlayLink.attributes('to')).toBe('/test-link');
  });

  it('should render the correct aria-label for the overlay link', () => {
    const blockWithLinkTarget = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        image: {
          ...mockImageBlock.content.image,
          linktarget: '/test-link',
        },
        text: {
          ...mockImageBlock.content.text,
          textOverlay: '',
        },
        button: {
          ...mockImageBlock.content.button,
          label: '',
          link: '',
        },
      },
    };
    const wrapper = mount(Image, { props: blockWithLinkTarget });
    const overlayLink = wrapper.find('[data-testid="image-link"]');
    expect(overlayLink.attributes('aria-label')).toBe(blockWithLinkTarget.content.image.alt);
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
    expect(overlay.text()).toBe(mockImageBlock.content.text.textOverlay);
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

  it('should apply top vertical alignment', () => {
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

  it('should apply center vertical alignment', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        text: { ...mockImageBlock.content.text, textOverlayAlignY: 'center' as 'center' | 'top' | 'bottom' },
      },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.classes()).toContain('items-center');
  });

  it('should apply bottom vertical alignment', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        text: { ...mockImageBlock.content.text, textOverlayAlignY: 'bottom' as 'bottom' | 'top' | 'center' },
      },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.classes()).toContain('items-end');
  });

  it('should apply left horizontal alignment', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        text: { ...mockImageBlock.content.text, textOverlayAlignX: 'left' as 'left' | 'center' | 'right' },
      },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.classes()).toContain('justify-start');
  });

  it('should apply center horizontal alignment', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        text: { ...mockImageBlock.content.text, textOverlayAlignX: 'center' as 'left' | 'center' | 'right' },
      },
    };
    const wrapper = mount(Image, { props: block });
    const overlay = wrapper.find('[data-testid="image-overlay-text"]');
    expect(overlay.classes()).toContain('justify-center');
  });

  it('should apply right horizontal alignment', () => {
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
