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
    expect(classes['mx-auto mt-3']).toBe(true);
    expect(classes['px-4 md:px-6']).toBe(true);
  });

  //   it('omits container width class when fullWidth', () => {
  //     const classes = buildBlockClasses(fakeBlock(), {
  //       fullWidth: true,
  //       rule: { container: true, padding: true, defaultFullWidth: true },
  //       horizontalSpacing: 'm',
  //     });
  //     expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(false);
  //     expect(classes['mx-auto mt-3']).toBe(true);
  //   });

  //   it('omits container width and centering when container excluded', () => {
  //     const classes = buildBlockClasses(fakeBlock('Footer'), {
  //       fullWidth: false,
  //       rule: { container: false, padding: true, defaultFullWidth: true },
  //       horizontalSpacing: 'l',
  //     });
  //     expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(false);
  //     expect(classes['mx-auto mt-3']).toBe(false);
  //     expect(classes['px-4 md:px-6']).toBe(true);
  //   });

  it('should omit padding when padding excluded', () => {
    const classes = buildBlockClasses(fakeBlock('Image'), {
      fullWidth: false,
      rule: { container: true, padding: false, defaultFullWidth: false },
      horizontalSpacing: 's',
    });
    expect(classes['px-4 md:px-6']).toBe(false);
    expect(Object.keys(classes).some((k) => k.startsWith('max-w-'))).toBe(true);
  });

  it('should use default spacing when key is unknown', () => {
    const classes = buildBlockClasses(fakeBlock(), {
      fullWidth: false,
      rule: { container: true, padding: true, defaultFullWidth: true },
      horizontalSpacing: '??',
    });
    // default is max-w-screen-3xl
    expect(classes['max-w-screen-3xl']).toBe(true);
  });
});
