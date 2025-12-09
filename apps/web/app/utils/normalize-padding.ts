import type { PaddingLayout } from '~/types/blocks';

/**
 * Legacy layout type that may contain string or mixed value types.
 */
type LegacyLayout = Partial<PaddingLayout> | Record<string, string | number | boolean | undefined>;

/**
 * Normalizes padding values from legacy string format to number format.
 *
 * @param layout - Padding layout object that may contain string or number values
 * @returns Normalized PaddingLayout with all number values
 *
 * @remarks
 * Legacy blocks (especially TextCard) stored padding values as strings (e.g., "10", "20px").
 * This function provides backward compatibility by converting those strings to numbers
 * while preserving any numeric values that already exist.
 *
 * The function handles multiple input formats:
 * - String values: "10", "20px" -> converted to numbers
 * - Number values: preserved as-is
 * - Missing values: defaulted to 0
 * - fullWidth: preserved if present
 *
 * @example
 * ```ts
 * // Legacy string padding
 * const legacy = { paddingTop: "10", paddingBottom: "20px" };
 * const normalized = normalizePadding(legacy);
 * // Result: { paddingTop: 10, paddingBottom: 20, paddingLeft: 0, paddingRight: 0 }
 *
 * // Already normalized
 * const modern = { paddingTop: 10, paddingBottom: 20, paddingLeft: 5, paddingRight: 5 };
 * const result = normalizePadding(modern);
 * // Result: same as input with defaults filled
 * ```
 */
export function normalizePadding(layout?: LegacyLayout): PaddingLayout {
  if (!layout) {
    return {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };
  }

  const toNumber = (value: string | number | boolean | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove 'px' suffix if present and parse
      const parsed = Number.parseInt(value.replace('px', ''), 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const toBoolean = (value: string | number | boolean | undefined): boolean | undefined => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return undefined;
  };

  return {
    paddingTop: toNumber(layout.paddingTop),
    paddingBottom: toNumber(layout.paddingBottom),
    paddingLeft: toNumber(layout.paddingLeft),
    paddingRight: toNumber(layout.paddingRight),
    fullWidth: toBoolean(layout.fullWidth),
  };
}

/**
 * Ensures layout object has all required padding defaults.
 *
 * @param layout - Any layout object that may be missing padding properties
 * @returns Complete PaddingLayout with defaults for missing values
 *
 * @remarks
 * This helper is primarily used in form components (e.g., ImageForm.vue)
 * to initialize padding properties when they don't exist on the block content.
 *
 * Unlike normalizePadding(), this function is designed for initialization
 * rather than migration, and sets all missing numeric padding values to 0.
 *
 * @example
 * ```ts
 * // In a form component
 * const rawContent = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};
 * if (!rawContent.layout) {
 *   rawContent.layout = ensureLayoutDefaults({});
 * }
 * ```
 */
export function ensureLayoutDefaults(layout: Record<string, unknown> | undefined): PaddingLayout {
  const asNumber = (value: unknown): number => {
    return typeof value === 'number' ? value : 0;
  };

  const asBoolean = (value: unknown): boolean | undefined => {
    return typeof value === 'boolean' ? value : undefined;
  };

  return {
    paddingTop: asNumber(layout?.paddingTop),
    paddingBottom: asNumber(layout?.paddingBottom),
    paddingLeft: asNumber(layout?.paddingLeft),
    paddingRight: asNumber(layout?.paddingRight),
    fullWidth: asBoolean(layout?.fullWidth),
  };
}
