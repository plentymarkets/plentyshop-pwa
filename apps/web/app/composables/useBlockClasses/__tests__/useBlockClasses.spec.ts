import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';

const { useSiteSettings } = vi.hoisted(() => {
  return {
    useSiteSettings: vi.fn().mockImplementation(() => ({ getSetting: () => 'm' })),
  };
});

mockNuxtImport('useSiteSettings', () => useSiteSettings);

vi.mock('~/configuration/block-layout.config', () => {
  return {
    resolveBlockLayoutRule: vi.fn((name: string) => {
      if (name === 'Footer') return { container: false, padding: false, defaultFullWidth: true };
      if (name === 'NoPadding') return { container: true, padding: false, defaultFullWidth: true };
      return { container: true, padding: true, defaultFullWidth: true };
    }),
  };
});
const contentBlock = (name = 'TextCard', fullWidth?: boolean): Block =>
  ({
    name,
    type: 'content',
    meta: { uuid: 'test-uuid' },
    content: fullWidth === undefined ? {} : { layout: { fullWidth } },
  }) as unknown as Block;

describe('useBlockClasses', () => {
  beforeEach(() => {
    useSiteSettings.mockImplementation(() => ({ getSetting: () => 'm' }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add container max-width and centering when block is not fullWidth and container is enabled', () => {
    const block = contentBlock('TextCard', false);
    const classes = useBlockClasses(block).value;
    expect(classes['max-w-screen-2xl']).toBe(true);
    expect(classes['mx-auto']).toBe(true);
  });

  it('should not add container max-width when block is fullWidth, but should still center the container', () => {
    const block = contentBlock('TextCard', true);
    const classes = useBlockClasses(block).value;
    expect(classes['max-w-screen-2xl']).toBeFalsy();
    expect(classes['mx-auto']).toBe(true);
  });

  it('should use defaultFullWidth from rules when explicit is not provided', () => {
    const block = contentBlock('TextCard');
    const classes = useBlockClasses(block).value;
    expect(Object.keys(classes).some((className) => className.startsWith('max-w-'))).toBe(true);
  });

  it.each(['s', 'm', 'l'])('should use site setting spacing key "%s"', (key) => {
    useSiteSettings.mockImplementation(() => ({ getSetting: () => key }));
    const block = contentBlock('Multigrid', false);
    const classes = useBlockClasses(block).value;

    const expectedClass = getHorizontalClass(key);
    expect(classes[expectedClass]).toBe(true);
  });
});
