import { describe, it, expect } from 'vitest';
import { mockImageBlock } from './Image.mock';
import { mount } from '@vue/test-utils';
import Image from '../../../../components/blocks/Image/Image.vue';

describe('Image block button', () => {
  it('should not render a button if no button is provided', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        button: {},
      },
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-button"]').exists()).toBe(false);
  });

  it('should not render a button if no label is provided', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        button: {
          ...mockImageBlock.content.button,
          label: '',
        },
      },
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-button"]').exists()).toBe(false);
  });
  it('should not render a button if no link is provided', () => {
    const block = {
      ...mockImageBlock,
      content: {
        ...mockImageBlock.content,
        button: {
          ...mockImageBlock.content.button,
          link: '',
        },
      },
    };
    const wrapper = mount(Image, { props: block });
    expect(wrapper.find('[data-testid="image-button"]').exists()).toBe(false);
  });
});
