import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { LocalizationMessage } from '@plentymarkets/shop-core';
import TranslationInput from '../TranslationInput.vue';

const createTranslation = (input: string, defaultVal?: string): LocalizationMessage => ({
  value: input,
  input,
  default: defaultVal,
  isDeployed: false,
});

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>();
  return { ...actual, useDebounceFn: (fn: (...args: unknown[]) => unknown) => fn };
});

const selectedLocales = ref<string[]>(['en']);

const { useEditorLocalizationLocales } = vi.hoisted(() => ({
  useEditorLocalizationLocales: vi.fn(() => ({ selectedLocales })),
}));

const { getEditorTranslation } = vi.hoisted(() => ({
  getEditorTranslation: vi.fn((key: string) => key),
}));

mockNuxtImport('useEditorLocalizationLocales', () => useEditorLocalizationLocales);
mockNuxtImport('getEditorTranslation', () => getEditorTranslation);

const createWrapper = (
  props: {
    rowKey?: string;
    lang?: string;
    translation?: LocalizationMessage;
  } = {},
) => {
  return mount(TranslationInput, {
    props: {
      rowKey: 'homepage.title',
      lang: 'en',
      translation: createTranslation('Hello world', 'Hello world'),
      ...props,
    },
    global: {
      stubs: {
        SfTooltip: { template: '<div><slot /></div>' },
        SfIconBase: { template: '<span />' },
      },
    },
  });
};

describe('TranslationInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    selectedLocales.value = ['en'];
    useEditorLocalizationLocales.mockImplementation(() => ({ selectedLocales }));
    getEditorTranslation.mockImplementation((key: string) => key);
  });

  describe('translation field visibility', () => {
    it('should show the text field when a translation value exists', () => {
      const wrapper = createWrapper({ translation: createTranslation('Welcome', 'Welcome') });

      expect(wrapper.find('textarea').exists()).toBe(true);
    });

    it('should hide the text field when the translation has no value yet', () => {
      const wrapper = createWrapper({ translation: undefined });

      expect(wrapper.find('textarea').exists()).toBe(false);
    });

    it('should display the current translation text in the field', () => {
      const wrapper = createWrapper({ translation: createTranslation('Buy now', 'Buy now') });

      expect(wrapper.get('textarea').element.value).toBe('Buy now');
    });
  });

  describe('typing a new translation', () => {
    it('should emit the new value when the user types in the field', async () => {
      const wrapper = createWrapper({ translation: createTranslation('Old text', 'Old text') });

      const textarea = wrapper.get('textarea');
      await textarea.setValue('New text');
      await textarea.trigger('input');

      const args = wrapper.emitted('update')?.[0];
      expect(args?.[0]).toBe('homepage.title');
      expect(args?.[1]).toBe('en');
      expect(args?.[2]).toBe('New text');
    });
  });

  describe('reverting to the default translation', () => {
    it('should show the revert button when the text differs from the default', () => {
      const wrapper = createWrapper({ translation: createTranslation('Custom text', 'Original text') });

      const revertArea = wrapper.find('.cursor-pointer');
      expect(revertArea.element.parentElement?.style.display).not.toBe('none');
    });

    it('should hide the revert button when no default translation exists', () => {
      const wrapper = createWrapper({ translation: createTranslation('Some text') });

      const revertArea = wrapper.find('.cursor-pointer');
      expect(revertArea.element.parentElement?.style.display).toBe('none');
    });

    it('should hide the revert button when the text already matches the default', () => {
      const wrapper = createWrapper({ translation: createTranslation('Same text', 'Same text') });

      const revertArea = wrapper.find('.cursor-pointer');
      expect(revertArea.element.parentElement?.style.display).toBe('none');
    });

    it('should emit the revert event with the full translation data when the revert button is clicked', async () => {
      const translation = createTranslation('Custom text', 'Original text');
      const wrapper = createWrapper({ translation });

      await wrapper.find('.cursor-pointer').trigger('click');

      const args = wrapper.emitted('revert')?.[0];
      expect(args?.[0]).toBe('homepage.title');
      expect(args?.[1]).toBe('en');
      expect(args?.[2]).toEqual(translation);
    });
  });

  describe('"using default" indicator', () => {
    it('should show the default indicator when the text has not been changed from the default', () => {
      const wrapper = createWrapper({ translation: createTranslation('Default text', 'Default text') });

      const defaultBadge = wrapper.find('.bg-neutral-100.text-xs');
      expect(defaultBadge.element.parentElement?.style.display).not.toBe('none');
    });

    it('should hide the default indicator when the text has been customized', () => {
      const wrapper = createWrapper({ translation: createTranslation('My custom text', 'Default text') });

      const defaultBadge = wrapper.find('.bg-neutral-100.text-xs');
      expect(defaultBadge.element.parentElement?.style.display).toBe('none');
    });
  });

  describe('picking up external translation changes', () => {
    it('should update the displayed text when the parent provides a new translation value', async () => {
      const wrapper = createWrapper({ translation: createTranslation('Initial', 'Initial') });

      await wrapper.setProps({ translation: createTranslation('Updated from server', 'Initial') });

      expect(wrapper.get('textarea').element.value).toBe('Updated from server');
    });

    it('should keep the current text when the new prop value matches what the user already typed', async () => {
      const wrapper = createWrapper({ translation: createTranslation('Typed value', 'Default') });

      await wrapper.setProps({ translation: createTranslation('Typed value', 'Default') });

      expect(wrapper.get('textarea').element.value).toBe('Typed value');
    });
  });

  describe('layout when multiple languages are selected', () => {
    it('should expand to full width when only one language is selected', () => {
      selectedLocales.value = ['en'];
      const wrapper = createWrapper();

      expect(wrapper.find('div').classes()).toContain('!w-full');
    });

    it('should share the row equally when two languages are selected', () => {
      selectedLocales.value = ['en', 'de'];
      const wrapper = createWrapper();

      expect(wrapper.find('div').classes()).toContain('!w-[calc(50%-4px)]');
    });
  });
});
