// import { describe, it, expect, vi } from 'vitest';
// import { mockNuxtImport } from '@nuxt/test-utils/runtime';
// import type { Block } from '@plentymarkets/shop-api';

// // hoist the stub first
// const { useBlockClasses } = vi.hoisted(() => {
//   return {
//     useBlockClasses: vi.fn((block: Block) => {
//       const hasContainer = block?.name === 'NeedsContainer';
//       return {
//         value: {
//           'mx-auto mt-3': true,
//           'px-4 md:px-6': true,
//           'max-w-screen-2xl': hasContainer,
//         },
//       } as unknown; // ComputedRef-like shape
//     }),
//   };

// });

// // register mock BEFORE importing SUT
// mockNuxtImport('useBlockClasses', () => useBlockClasses);

// // now import the SUT (top-level await supported by Vitest)
// const { getBlockClass } = await import('../getBlockClass');

// describe('getBlockClass wrapper', () => {
//   it('delegates to useBlockClasses and returns its computed value', () => {
//     const block = { name: 'NeedsContainer' } as unknown as Block;
//     const result = getBlockClass(block).value;
//     expect(result['max-w-screen-2xl']).toBe(true);
//     expect(useBlockClasses).toHaveBeenCalledOnce();
//   });

//   it('returns whatever the composable provides', () => {
//     const block = { name: 'Footer' } as unknown as Block;
//     const result = getBlockClass(block).value;
//     expect(result['mx-auto mt-3']).toBe(true);
//     expect(result['max-w-screen-2xl']).toBeFalsy();
//   });
// });
