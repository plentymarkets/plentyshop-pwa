import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TextCard from '../TextCard.vue';
import { mockTextCard } from './TextCard.mock';

describe('TextCard - Button Property', () => {
  it('should render the button with the correct link', () => {
    const wrapper = mount(TextCard, { props: mockTextCard });
    const button = wrapper.find('[data-testid="text-button"]');
    expect(button.attributes('to')).toBe(mockTextCard.content.button.link);
  });

  it('should not render the button if the label is missing', () => {
    const mockWithoutLabel = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        button: {
          ...mockTextCard.content.button,
          label: undefined,
        },
      },
    };
    const wrapper = mount(TextCard, { props: mockWithoutLabel });
    const button = wrapper.find('[data-testid="text-button"]');
    expect(button.exists()).toBe(false);
  });

  it('should not render the button if the link is missing', () => {
    const mockWithoutLink = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        button: {
          ...mockTextCard.content.button,
          link: undefined,
        },
      },
    };
    const wrapper = mount(TextCard, { props: mockWithoutLink });
    const button = wrapper.find('[data-testid="text-button"]');
    expect(button.exists()).toBe(false);
  });

  it('should handle missing button gracefully', () => {
    const mockWithoutButton = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        button: {},
      },
    };
    const wrapper = mount(TextCard, { props: mockWithoutButton });
    const button = wrapper.find('[data-testid="text-button"]');
    expect(button.exists()).toBe(false);
  });
});
