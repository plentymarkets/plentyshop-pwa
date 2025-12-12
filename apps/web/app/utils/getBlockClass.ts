import type { Block } from '@plentymarkets/shop-api';
import type { ComputedRef } from 'vue';

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
export const hasProperty = <K extends string>(obj: object, key: K): obj is Record<K, unknown> => {
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
export const getNestedValue = <T>(obj: unknown, path: string[], expectedType: string): T | undefined => {
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
// NOTE: FullWidth resolution and spacing mapping are handled in useBlockClasses/buildBlockClasses.

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
  return useBlockClasses(block);
};
