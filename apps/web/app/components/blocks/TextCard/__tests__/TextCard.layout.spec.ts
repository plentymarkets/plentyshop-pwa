import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TextCard from '../TextCard.vue';
import { mockTextCard } from './TextCard.mock';

describe('TextCard - Layout Property', () => {
  it('should apply the correct background color', () => {
    const wrapper = mount(TextCard, { props: mockTextCard });
    const textCard = wrapper.find('[data-testid="text-card"]');
    expect(textCard.exists()).toBe(true);
    expect(textCard.attributes('style')).toContain('background-color: #f9f9f9');
  });

  it('should apply the correct padding values', () => {
    const mockWithPadding = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        layout: {
          ...mockTextCard.content.layout,
          paddingTop: '10',
          paddingBottom: '20',
          paddingLeft: '15',
          paddingRight: '25',
        },
      },
    };

    const wrapper = mount(TextCard, { props: mockWithPadding });

    const textCard = wrapper.find('[data-testid="text-card"]');
    expect(textCard.attributes('style')).toContain('padding: 10px 25px 20px 15px;');
  });

  it('should use default layout values if none are provided', () => {
    const mockWithoutLayout = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        layout: {},
      },
    };

    const wrapper = mount(TextCard, { props: mockWithoutLayout });
    const textCard = wrapper.find('[data-testid="text-card"]');
    expect(textCard.attributes('style')).toContain('background-color: transparent');
    expect(textCard.attributes('style')).toContain('padding: 0px;');
  });

  it('should apply mixed layout values correctly', () => {
    const mockWithMixedLayout = {
      ...mockTextCard,
      content: {
        ...mockTextCard.content,
        layout: {
          backgroundColor: '#e0e0e0',
          paddingTop: '5',
          paddingBottom: undefined,
          paddingLeft: '10',
          paddingRight: undefined,
        },
      },
    };

    const wrapper = mount(TextCard, { props: mockWithMixedLayout });
    const textCard = wrapper.find('[data-testid="text-card"]');
    expect(textCard.attributes('style')).toContain('background-color: #e0e0e0');
    expect(textCard.attributes('style')).toContain('padding: 5px 0px 0px 10px;');
  });
});
