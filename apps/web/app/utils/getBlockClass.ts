import type { Block } from '@plentymarkets/shop-api';
import { computed, type ComputedRef } from 'vue';
import { useSiteSettings } from '~/composables/useSiteSettings/useSiteSettings';
import { resolveBlockLayoutRule } from '~/configuration/block-layout.config';

// NOTE: Exclusion sets were replaced by a centralized configuration in
// '~/configuration/block-layout.config'.

/**
 * Checks if a block has fullWidth enabled in any of its layout locations
 *
 * Supports two possible locations:
 * - block.content.layout.fullWidth (Banner, etc.) - defaults to false
 * - block.configuration.layout.fullWidth (TextCard, Image, etc.) - defaults to true
 *
 * @param block - The block to check
 * @returns True if fullWidth is enabled
 */
/**
 * Type guard to check if an object has a specific property
 */
const hasProperty = <K extends string>(obj: object, key: K): obj is Record<K, unknown> => {
  return key in obj;
};

/**
 * Safely extracts a nested value of a specific type from an object structure
 *
 * @param obj - The object to check (e.g., block.content or block.configuration)
 * @param path - Array of property names forming the path to the value (e.g., ['layout', 'fullWidth'])
 * @param expectedType - The expected JavaScript type ('boolean', 'string', 'number', etc.)
 * @returns The typed value if found and matches the expected type, undefined otherwise
 *
 * @example
 * ```ts
 * getNestedValue(block.content, ['layout', 'fullWidth'], 'boolean') // returns boolean | undefined
 * getNestedValue(block.configuration, ['controls', 'color'], 'string') // returns string | undefined
 * getNestedValue(block.content, ['layout', 'paddingTop'], 'number') // returns number | undefined
 * ```
 */
const getNestedValue = <T>(obj: unknown, path: string[], expectedType: string): T | undefined => {
  if (!obj || typeof obj !== 'object') return undefined;

  let current: unknown = obj;

  for (const key of path) {
    if (!current || typeof current !== 'object') return undefined;
    if (!hasProperty(current, key)) return undefined;
    current = current[key];
  }

  return typeof current === expectedType ? (current as T) : undefined;
};

/**
 * Safely extracts the fullWidth boolean from a nested object structure
 *
 * @param obj - The object to check (e.g., block.content or block.configuration)
 * @returns The fullWidth value if found, undefined otherwise
 */
const getFullWidthFromObject = (obj: unknown): boolean | undefined => {
  return getNestedValue<boolean>(obj, ['layout', 'fullWidth'], 'boolean');
};

/**
 * Checks if a block has fullWidth enabled
 *
 * Content blocks check content.layout.fullWidth
 * Structure blocks check configuration.layout.fullWidth
 *
 * @param block - The block to check
 * @returns True if fullWidth is enabled
 */
const hasFullWidth = (block: Block): boolean => {
  const explicit =
    block.type === 'content' ? getFullWidthFromObject(block.content) : getFullWidthFromObject(block.configuration);
  if (explicit !== undefined) return explicit;
  const rule = resolveBlockLayoutRule(block.name);
  return rule.defaultFullWidth;
};
/**
 * Maps horizontal spacing setting to Tailwind max-width class
 */
// const horizontalSpacingClassMap: Record<string, string> = {
//   s: 'max-w-screen-xl',
//   m: 'max-w-screen-2xl',
//   l: 'max-w-screen-3xl',
//   xl: 'max-w-screen-4xl',
// };

const horizontalSpacingClassMap: Record<string, string> = {
  s: 'max-w-screen-3xl',
  m: 'max-w-screen-2xl',
  l: 'max-w-screen-xl',
};

/**
 * Generates CSS classes for a block based on its properties and configuration,
 * including horizontal spacing setting.
 * Generates CSS classes for a block based on its properties and configuration
 *
 * @param block - The block to generate classes for
 * @returns Computed ref with CSS class object
 *
 * @example
 * ```ts
 * <PageBlock :class="getBlockClass(block).value">
 * ```
 */
export const getBlockClass = (block: Block): ComputedRef<Record<string, boolean>> => {
  const { getSetting } = useSiteSettings('horizontalBlockSize');
  return computed(() => {
    const fullWidth = hasFullWidth(block);
    const rule = resolveBlockLayoutRule(block.name);
    const isContainerExcluded = rule.container === false;
    const isPaddingExcluded = rule.padding === false;

    const horizontalSpacing = getSetting();
    const horizontalClass =
      !fullWidth && !isContainerExcluded && horizontalSpacingClassMap[horizontalSpacing]
        ? horizontalSpacingClassMap[horizontalSpacing]
        : 'max-w-screen-3xl';

    return {
      [horizontalClass]: !fullWidth && !isContainerExcluded,
      'mx-auto mt-3': !isContainerExcluded,
      'px-4 md:px-6': !isPaddingExcluded,
    };
  });
};
