import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TextCard from '../TextCard.vue';
import { mockTextCard } from './TextCard.mock';

describe('TextCard - Text Property', () => {
  it('should render the pretitle correctly', () => {
    const wrapper = mount(TextCard, { props: mockTextCard });
    const pretitle = wrapper.find('[data-testid="text-pretitle"]');
    expect(pretitle.exists()).toBe(true);
    expect(pretitle.text()).toBe(mockTextCard.content.text.pretitle);
  });

  it('should render the title correctly as an H1 for the first block', () => {
    const wrapper = mount(TextCard, { props: { ...mockTextCard, index: 0 } });
    const title = wrapper.find('[data-testid="text-title"]');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(mockTextCard.content.text.title);
    expect(title.element.tagName).toBe('H1');
  });

  it('should render the title correctly as an H2 for non-first blocks', () => {
    const wrapper = mount(TextCard, { props: { ...mockTextCard, index: 1 } });
    const title = wrapper.find('[data-testid="text-title"]');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(mockTextCard.content.text.title);
    expect(title.element.tagName).toBe('H2');
  });

  it('should apply the correct text color', () => {
    const mockWithColor = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        text: {
          ...mockTextCard.content.text,
          color: '#ff5733',
        },
      },
    };

    const wrapper = mount(TextCard, { props: mockWithColor });
    const textContent = wrapper.find('[data-testid="text-content"]');
    expect(textContent.attributes('style')).toContain('color: #ff5733');
  });

  it('should render the subtitle correctly', () => {
    const wrapper = mount(TextCard, { props: mockTextCard });
    const subtitle = wrapper.find('[data-testid="text-subtitle"]');
    expect(subtitle.exists()).toBe(true);
    expect(subtitle.text()).toBe(mockTextCard.content.text.subtitle);
  });

  it('should render the HTML description correctly', () => {
    const wrapper = mount(TextCard, { props: mockTextCard });
    const description = wrapper.find('[data-testid="text-html"]');
    expect(description.exists()).toBe(true);
    expect(description.html()).toContain(mockTextCard.content.text.htmlDescription);
  });

  it.each(['left', 'center', 'right'] as const)(
    'should apply the correct text alignment class for alignment',
    (alignment) => {
      const mockWithAlignment = {
        ...mockTextCard,
        content: {
          ...mockTextCard.content,
          text: {
            ...mockTextCard.content.text,
            textAlignment: alignment,
          },
        },
      };

      const wrapper = mount(TextCard, { props: mockWithAlignment });
      const textCard = wrapper.find('[data-testid="text-card"]');
      expect(textCard.classes()).toContain(`text-${alignment}`);
    },
  );

  it('should apply the default text alignment class if none is provided', () => {
    const mockWithoutAlignment = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        text: {
          ...mockTextCard.content.text,
          textAlignment: undefined,
        },
      },
    };
    const wrapper = mount(TextCard, { props: mockWithoutAlignment });
    const textCard = wrapper.find('[data-testid="text-card"]');
    expect(textCard.classes()).toContain('text-left');
  });

  it('should handle missing optional fields gracefully', () => {
    const mockWithoutOptionalFields = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        text: {
          ...mockTextCard.content.text,
          pretitle: '',
          subtitle: '',
          htmlDescription: '',
        },
      },
    };
    const wrapper = mount(TextCard, { props: mockWithoutOptionalFields });
    expect(wrapper.find('[data-testid="text-pretitle"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="text-subtitle"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="text-html"]').exists()).toBe(false);
  });
});
