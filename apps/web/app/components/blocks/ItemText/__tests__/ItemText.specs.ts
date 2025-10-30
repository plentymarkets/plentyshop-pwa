import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ItemTextMock } from './ItemText.mock';
import ItemText from '../ItemText.vue';

describe('ItemText.vue', () => {
  it('should render item text accordeo open if displayAsCollapsable and initallyCollapsed is true', async () => {
    const wrapper = mount(ItemText, {
      props: { ...ItemTextMock },
    });
    const itemText = wrapper.find('[data-testid="item-text-innertext"]');

    expect(itemText.exists()).toBe(true);
  });
  it('should render element with correct padding', () => {
    const wrapper = mount(ItemText, {
      props: { ...ItemTextMock },
    });
    const itemText = wrapper.find('[data-testid="item-text-block"]');

    expect(itemText.attributes('style')).toContain(`padding-top: 10px;`);
  });
});
