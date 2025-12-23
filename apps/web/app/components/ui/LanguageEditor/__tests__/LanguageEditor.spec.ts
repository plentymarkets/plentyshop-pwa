import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import LanguageEditor from '../LanguageEditor.vue';

interface LanguageEditorInstance {
  measureRef: { offsetWidth: number } | null | undefined;
  selectWidth: string;
  updateWidth(): Promise<void>;
}

describe('LanguageEditor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateWidth', () => {
    it('should calculate select width based on measureRef offsetWidth plus 5px', async () => {
      const mockSwitchLocale = vi.fn().mockResolvedValue(undefined);

      const wrapper = mount(LanguageEditor, {
        global: {
          stubs: {
            SfTooltip: true,
            SfIconLanguage: true,
            SfIconExpandMore: true,
          },
          mocks: {
            useI18n: () => ({
              locale: 'en',
              availableLocales: ['en', 'de'],
              t: (key: string) => key,
            }),
            useLocalization: () => ({
              switchLocale: mockSwitchLocale,
            }),
          },
        },
      });

      await flushPromises();
      await nextTick();

      const vm = wrapper.vm as unknown as LanguageEditorInstance;
      vm.measureRef = { offsetWidth: 50 };

      await vm.updateWidth();

      expect(vm.selectWidth).toBe('55px');
    });

    it('should not update selectWidth when measureRef is null', async () => {
      const wrapper = mount(LanguageEditor, {
        global: {
          stubs: {
            SfTooltip: true,
            SfIconLanguage: true,
            SfIconExpandMore: true,
          },
          mocks: {
            useI18n: () => ({
              locale: 'en',
              availableLocales: ['en', 'de'],
              t: (key: string) => key,
            }),
            useLocalization: () => ({
              switchLocale: vi.fn().mockResolvedValue(undefined),
            }),
          },
        },
      });

      await flushPromises();
      const vm = wrapper.vm as unknown as LanguageEditorInstance;
      const initialWidth = vm.selectWidth;

      vm.measureRef = null;
      await vm.updateWidth();

      expect(vm.selectWidth).toBe(initialWidth);
    });

    it('should not update selectWidth when measureRef is undefined', async () => {
      const wrapper = mount(LanguageEditor, {
        global: {
          stubs: {
            SfTooltip: true,
            SfIconLanguage: true,
            SfIconExpandMore: true,
          },
          mocks: {
            useI18n: () => ({
              locale: 'en',
              availableLocales: ['en', 'de'],
              t: (key: string) => key,
            }),
            useLocalization: () => ({
              switchLocale: vi.fn().mockResolvedValue(undefined),
            }),
          },
        },
      });

      await flushPromises();
      const vm = wrapper.vm as unknown as LanguageEditorInstance;
      const initialWidth = vm.selectWidth;

      vm.measureRef = undefined;
      await vm.updateWidth();

      expect(vm.selectWidth).toBe(initialWidth);
    });

    it('should handle various offsetWidth values correctly', async () => {
      const wrapper = mount(LanguageEditor, {
        global: {
          stubs: {
            SfTooltip: true,
            SfIconLanguage: true,
            SfIconExpandMore: true,
          },
          mocks: {
            useI18n: () => ({
              locale: 'en',
              availableLocales: ['en', 'de'],
              t: (key: string) => key,
            }),
            useLocalization: () => ({
              switchLocale: vi.fn().mockResolvedValue(undefined),
            }),
          },
        },
      });

      await flushPromises();
      const vm = wrapper.vm as unknown as LanguageEditorInstance;

      const testCases = [0, 25, 100, 200];

      for (const offsetWidth of testCases) {
        vm.measureRef = { offsetWidth };
        await vm.updateWidth();
        expect(vm.selectWidth).toBe(`${offsetWidth + 5}px`);
      }
    });
  });
});
