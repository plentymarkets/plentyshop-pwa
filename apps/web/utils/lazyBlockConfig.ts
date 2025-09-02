/**
 * Configuration for blocks that support lazy loading
 *
 * To add a new lazy-loadable block:
 * 1. Add the block name as a key to the LAZY_LOAD_BLOCKS object
 * 2. Specify the configuration for that block
 * 3. In your block component, accept the prop specified in 'propName'
 * 4. Implement the lazy loading logic in your component
 *
 * Example:
 * ```typescript
 * MyLazyBlock: {
 *   propName: 'isVisible',
 *   rootMargin: '0px 0px 200px 0px',
 *   threshold: 0,
 * }
 * ```
 */

export interface LazyLoadConfig {
  propName: string; // The prop name to pass to the component (e.g., 'shouldLoad')
  rootMargin?: string; // IntersectionObserver rootMargin
  threshold?: number; // IntersectionObserver threshold
}

// Whitelist of blocks that support lazy-loading
export const LAZY_LOAD_BLOCKS: Record<string, LazyLoadConfig> = {
  ProductRecommendedProducts: {
    propName: 'shouldLoad',
    rootMargin: '0px 0px 150px 0px',
    threshold: 0,
  },
  // Add more blocks here in the future:
  // AnotherLazyBlock: {
  //   propName: 'shouldLoad',
  //   rootMargin: '0px 0px 200px 0px',
  //   threshold: 0.1,
  // },
  // YetAnotherBlock: {
  //   propName: 'isInViewport',
  //   rootMargin: '0px 0px 100px 0px',
  //   threshold: 0.5,
  // },
};

// Helper functions for lazy-loading
export const shouldLazyLoad = (blockName: string): boolean => {
  return blockName in LAZY_LOAD_BLOCKS;
};

export const getLazyLoadKey = (blockName: string): string => {
  return blockName.charAt(0).toLowerCase() + blockName.slice(1);
};

export const getLazyLoadConfig = (blockName: string): LazyLoadConfig | null => {
  return LAZY_LOAD_BLOCKS[blockName] || null;
};
