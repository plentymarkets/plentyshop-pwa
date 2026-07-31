import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useEditorDevice } from '../useEditorDevice';

const breakpoint = ref('lg');
const queries = ref({
  lg: { mediaQuery: '(min-width: 1024px)' },
  md: { mediaQuery: '(min-width: 768px)' },
  sm: { mediaQuery: '(min-width: 640px)' },
});

mockNuxtImport('useViewport', () => () => ({
  breakpoint,
  queries,
}));

describe('useEditorDevice', () => {
  beforeEach(() => {
    delete (window as unknown as Record<string, unknown>).__editorPreviewDevice;
    breakpoint.value = 'lg';
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('width', () => {
    it('returns 375px for mobile device', () => {
      const { device, width } = useEditorDevice();
      device.value = 'mobile';
      expect(width.value).toBe('375px');
    });

    it('returns 768px for tablet device', () => {
      const { device, width } = useEditorDevice();
      device.value = 'tablet';
      expect(width.value).toBe('768px');
    });

    it('returns 100% for desktop device', () => {
      const { device, width } = useEditorDevice();
      device.value = 'desktop';
      expect(width.value).toBe('100%');
    });
  });

  describe('setDevice', () => {
    it('updates device.value immediately', () => {
      const { device, setDevice } = useEditorDevice();
      setDevice('mobile');
      expect(device.value).toBe('mobile');
    });

    it('defers viewport breakpoint to xs for mobile until nextTick', async () => {
      const { setDevice } = useEditorDevice();
      setDevice('mobile');
      expect(breakpoint.value).toBe('lg');

      await nextTick();
      expect(breakpoint.value).toBe('xs');
    });

    it('defers viewport breakpoint to md for tablet until nextTick', async () => {
      const { setDevice } = useEditorDevice();
      setDevice('tablet');
      expect(breakpoint.value).toBe('lg');

      await nextTick();
      expect(breakpoint.value).toBe('md');
    });

    it('restores viewport breakpoint via matchMedia for desktop', async () => {
      const { device, setDevice } = useEditorDevice();
      device.value = 'mobile';
      breakpoint.value = 'xs';

      setDevice('desktop');
      await nextTick();

      expect(breakpoint.value).toBe('lg');
    });
  });

  describe('device singleton', () => {
    it('shares the same device ref between composable instances', () => {
      const first = useEditorDevice();
      const second = useEditorDevice();
      first.setDevice('mobile');
      expect(second.device.value).toBe('mobile');
    });
  });
});
