import type { Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';

/**
 * Composable for managing the user's recently viewed products (last seen items).
 *
 * @remarks
 * **Legal Compliance Hint:** Using last seen tracking may require updates to the website's
 * privacy policy. Products are tracked based on the customer's last seen activity and this
 * information is temporarily stored server-side on the session. Consider consulting legal
 * counsel to verify compliance with applicable data protection regulations (e.g., GDPR).
 *
 * @returns An object containing methods to track product views
 *
 * @example
 * ```ts
 * const { addLastSeen } = useLastSeen();
 * addLastSeen(product);
 * ```
 */
export const useLastSeen = () => {
  /**
   * Adds a product to the user's last seen items list.
   * Only executes on the client side and silently ignores any errors.
   *
   * @param product - The product to add to the last seen list
   */
  const { getBooleanSetting: isLastSeenTrackingEnabled } = useSiteSettings('enableLastSeenTracking');

  const addLastSeen = (product: Product) => {
    if (import.meta.client && isLastSeenTrackingEnabled()) {
      try {
        useSdk().plentysystems.doAddLastSeen(productGetters.getVariationId(product));
      } catch {
        // Ignore errors
      }
    }
  };

  return {
    addLastSeen,
  };
};
