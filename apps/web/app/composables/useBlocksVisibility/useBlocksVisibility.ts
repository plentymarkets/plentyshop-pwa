import type { Block } from '@plentymarkets/shop-api';
import type { BlockVisibilityRegistry, UseBlocksVisibilityReturn } from './types';

/**
 * @description Composable for centralized block visibility control
 * Consolidates static content checks and runtime data state into a single visibility system
 * @returns useBlocksVisibility composable interface
 * @example
 * ``` ts
 * const { shouldShowBlock, registerBlockVisibility, unregisterBlockVisibility } = useBlocksVisibility();
 *
 * registerBlockVisibility(block.meta.uuid, hasRealData);
 *
 * v-if="shouldShowBlock(block, enableActions)"
 *
 * onBeforeUnmount(() => {
 *  clearRegistry();
 *  window.removeEventListener('beforeunload', handleBeforeUnload);
 * });
 * ```
 */
export const useBlocksVisibility: UseBlocksVisibilityReturn = () => {
  // Reactive registry where blocks can opt-in to register their runtime visibility state
  const visibilityRegistry = useState<BlockVisibilityRegistry>('block-visibility-registry', () => ({}));

  // Track when hydration is complete and registry can be safely used
  const isHydrationComplete = useState<boolean>('block-visibility-hydration-complete', () => false);

  /**
   * Check if a block has static content (non-empty configuration)
   */
  const hasStaticContent = (block: Block): boolean => {
    const options = block?.content;
    return !(!options || (typeof options === 'object' && Object.keys(options).length === 0));
  };

  /**
   * Register a block's runtime visibility state
   * Blocks should call this in onMounted and unregister in onBeforeUnmount
   * @param uuid - Block's meta.uuid
   * @param hasData - Indicates if block has data to display
   */
  const registerBlockVisibility = (uuid: string, hasData: boolean) => {
    visibilityRegistry.value[uuid] = hasData;
  };

  /**
   * Clear all registered blocks from the visibility registry
   * Should be called when the page unmounts to prevent memory leaks
   */
  const clearRegistry = () => {
    visibilityRegistry.value = {};
  };

  /**
   * Determine if a block should be shown
   * Checks both static configuration and registered runtime state
   * @param block - The block to check
   * @param isEditorModeEnabled - Whether editor mode is active (shows all blocks when true)
   * @returns true if block should be visible
   */
  const shouldShowBlock = (block: Block, isEditorModeEnabled = false): boolean => {
    if (!block?.meta) return false;

    if (isEditorModeEnabled) {
      return true;
    }

    if (!hasStaticContent(block)) {
      return false;
    }

    if (isHydrationComplete.value) {
      const runtimeVisibility = visibilityRegistry.value[block.meta.uuid];
      if (runtimeVisibility !== undefined) {
        return runtimeVisibility;
      }
    }

    return true;
  };

  return {
    shouldShowBlock,
    registerBlockVisibility,
    clearRegistry,
    isHydrationComplete,
  };
};
