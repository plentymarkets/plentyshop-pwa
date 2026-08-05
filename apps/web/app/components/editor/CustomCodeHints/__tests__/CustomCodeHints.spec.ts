import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import CustomCodeHints from '../CustomCodeHints.vue';

const { getEditorTranslationMock } = vi.hoisted(() => ({
  getEditorTranslationMock: vi.fn((key: string) => key),
}));

mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

describe('CustomCodeHints', () => {
  it('should not render when content has no custom code', () => {
    const wrapper = mount(CustomCodeHints, {
      props: {
        content: '<div>Hello World</div>',
      },
    });

    expect(wrapper.find('[data-testid="custom-code-hints"]').exists()).toBe(false);
  });

  it('should render with consistent styling', () => {
    const wrapper = mount(CustomCodeHints, {
      props: {
        content: '<style>.test { color: red; }</style>',
      },
    });

    const output = wrapper.find('[data-testid="custom-code-hints"]');
    expect(output.exists()).toBe(true);
    expect(output.classes()).toContain('my-2');
    expect(output.classes()).toContain('rounded-md');
  });

  it('should display CSS hint when style tag is present', () => {
    const wrapper = mount(CustomCodeHints, {
      props: {
        content: '<style>.test { color: red; }</style><div>Content</div>',
      },
    });

    const output = wrapper.find('[data-testid="custom-code-hints"]');
    expect(output.text()).toContain('customCodeHint.cssDetected');
  });

  it('should display JS hint when script tag is present', () => {
    const wrapper = mount(CustomCodeHints, {
      props: {
        content: '<script>console.log("test");</script><div>Content</div>',
      },
    });

    const output = wrapper.find('[data-testid="custom-code-hints"]');
    expect(output.text()).toContain('customCodeHint.jsDetected');
  });

  it('should display multiple hints', () => {
    const wrapper = mount(CustomCodeHints, {
      props: {
        content: '<style>.test { color: red; }</style><script>console.log("test");</script>',
      },
    });

    const output = wrapper.find('[data-testid="custom-code-hints"]');
    expect(output.text()).toContain('customCodeHint.cssDetected');
    expect(output.text()).toContain('customCodeHint.jsDetected');
  });

  it('should have correct styling classes', () => {
    const wrapper = mount(CustomCodeHints, {
      props: {
        content: '<style>.test { color: red; }</style>',
      },
    });

    const output = wrapper.find('[data-testid="custom-code-hints"]');
    expect(output.classes()).toContain('border');
    expect(output.classes()).toContain('border-blue-300');
    expect(output.classes()).toContain('bg-blue-50');
    expect(output.classes()).toContain('text-blue-800');
    expect(output.classes()).toContain('block');
  });
});
