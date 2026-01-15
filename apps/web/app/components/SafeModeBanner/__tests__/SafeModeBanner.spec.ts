import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SafeModeBanner from '../SafeModeBanner.vue';

describe('SafeModeBanner', () => {
  it('renders correctly', () => {
    const wrapper = mount(SafeModeBanner);

    expect(wrapper.find('[data-testid="safe-mode-banner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="close-safe-mode-banner"]').exists()).toBe(true);
  });
});
