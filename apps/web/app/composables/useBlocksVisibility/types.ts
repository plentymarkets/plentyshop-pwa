import type { Block } from '@plentymarkets/shop-api';

/**
 * Registry that maps block UUIDs to their runtime visibility state
 * Blocks can opt-in to register their runtime data availability
 */
export interface BlockVisibilityRegistry {
  [uuid: string]: boolean;
}

/**
 * Return type for the useBlocksVisibility composable
 */
export interface UseBlocksVisibility {
  /**
   * Determine if a block should be shown based on static content and runtime state
   * @param block - The block to check
   * @param isEditorModeEnabled - Whether editor mode is active (shows all blocks when true)
   * @returns true if block should be visible
   */
  shouldShowBlock: (block: Block, isEditorModeEnabled?: boolean) => boolean;

  /**
   * Register a block's runtime visibility state
   * @param uuid - Block's meta.uuid
   * @param hasData - Indicates if block has data to display
   */
  registerBlockVisibility: (uuid: string, hasData: boolean) => void;

  /**
   * Clear all registered blocks from the visibility registry
   * Should be called when the page unmounts
   */
  clearRegistry: () => void;
}

export type UseBlocksVisibilityReturn = () => UseBlocksVisibility;
