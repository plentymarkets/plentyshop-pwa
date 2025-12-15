import { describe, it, expect } from 'vitest';
import type { Block } from '@plentymarkets/shop-api';
import { buildBlockClasses } from '../block-classes';

const fakeBlock = (name = 'Any', type: 'content' | 'structure' = 'content'): Block =>
  ({ name, type }) as unknown as Block;

describe('utils/buildBlockClasses', () => {
  it('should apply container max-width when fullWidth=false and container is enabled', () => {
    const classes = buildBlockClasses(fakeBlock(), {
      fullWidth: false,
      rule: { container: true, padding: true, defaultFullWidth: true },
      horizontalSpacing: 'm',
    });
    expect(classes['max-w-screen-2xl']).toBe(true);
    expect(classes['mx-auto']).toBe(true);
    expect(classes['md:px-6 lg:px-10 p-4']).toBe(true);
  });

  it('should omit padding when padding excluded', () => {
    const classes = buildBlockClasses(fakeBlock('Image'), {
      fullWidth: false,
      rule: { container: true, padding: false, defaultFullWidth: false },
      horizontalSpacing: 's',
    });
    expect(classes['md:px-6 lg:px-10 p-4']).toBe(false);
    expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(true);
  });

  it('should use default spacing when key is unknown', () => {
    const classes = buildBlockClasses(fakeBlock(), {
      fullWidth: false,
      rule: { container: true, padding: true, defaultFullWidth: true },
      horizontalSpacing: '??',
    });
    expect(classes['max-w-screen-3xl']).toBe(true);
  });
});
