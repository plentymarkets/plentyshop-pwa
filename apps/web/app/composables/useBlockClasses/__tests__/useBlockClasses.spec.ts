import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import { useBlockClasses } from '../useBlockClasses';

// hoisted mocks so we can reconfigure per test
const { useSiteSettings } = vi.hoisted(() => {
  return {
    useSiteSettings: vi.fn().mockImplementation(() => ({ getSetting: () => 'm' })),
  };
});

mockNuxtImport('useSiteSettings', () => useSiteSettings);

vi.mock('~/configuration/block-layout.config', async () => {
  return {
    resolveBlockLayoutRule: vi.fn((name: string) => {
      // default: container & padding true, defaultFullWidth true
      if (name === 'Footer') return { container: false, padding: false, defaultFullWidth: true };
      if (name === 'NoPadding') return { container: true, padding: false, defaultFullWidth: true };
      return { container: true, padding: true, defaultFullWidth: true };
    }),
  };
});

const contentBlock = (name = 'Any', fullWidth?: boolean): Block =>
  ({
    name,
    type: 'content',
    content: fullWidth === undefined ? {} : { layout: { fullWidth } },
  }) as unknown as Block;

// const structureBlock = (name = 'Any', fullWidth?: boolean): Block =>
//   ({
//     name,
//     type: 'structure',
//     configuration: fullWidth === undefined ? {} : { layout: { fullWidth } },
//   }) as unknown as Block;

describe('useBlockClasses', () => {
  beforeEach(() => {
    useSiteSettings.mockImplementation(() => ({ getSetting: () => 'm' }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should apply container width when not fullWidth and rule allows container', () => {
    const block = contentBlock('Any', false);
    const classes = useBlockClasses(block).value;
    expect(classes['max-w-screen-2xl']).toBe(true);
    expect(classes['mx-auto mt-3']).toBe(true);
  });

  //   it('omits container width when fullWidth', () => {
  //     const block = structureBlock('Any', true);
  //     const classes = useBlockClasses(block).value;
  //     expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(false);
  //   });

  //   it('uses defaultFullWidth from rules when explicit not provided', () => {
  //     const block = contentBlock('Any');
  //     const classes = useBlockClasses(block).value;
  //     // default rule has defaultFullWidth true -> no container class
  //     expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(false);
  //   });

  //   it('honors container=false and padding=false from rules', () => {
  //     const block = contentBlock('Footer', false);
  //     const classes = useBlockClasses(block).value;
  //     expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(false);
  //     expect(classes['mx-auto mt-3']).toBe(false);
  //     expect(classes['px-4 md:px-6']).toBe(false);
  //   });

  it('should use site setting spacing key', () => {
    useSiteSettings.mockImplementation(() => ({ getSetting: () => 'l' }));
    const block = contentBlock('Any', false);
    const classes = useBlockClasses(block).value;
    expect(classes['max-w-screen-xl']).toBe(true);
  });
});
