import type { ComputedRef, Ref } from 'vue';

/**
 * @description Return type for useEditorState composable
 * Provides semantic state checks and feature flags for editor functionality
 */
export interface UseEditorStateReturn {
  // Core states
  /** Whether we are in the editor environment (true in both edit and preview modes) */
  isInEditor: ComputedRef<boolean>;
  /** Whether we are in edit mode (can modify blocks, shows editor UI, uses fake data) */
  isEditMode: ComputedRef<boolean>;
  /** Whether we are in preview mode (viewing changes without editing) */
  isPreviewMode: ComputedRef<boolean>;
  /** Whether we are in live/production mode (no editor features) */
  isLiveMode: ComputedRef<boolean>;

  // Feature flags
  /** Whether to show editor UI elements (toolbars, overlays, etc.) */
  shouldShowEditorUI: ComputedRef<boolean>;
  /** Whether to use fake/example data instead of real API data */
  shouldUseFakeData: ComputedRef<boolean>;
  /** Whether to hide zero/empty values in displays */
  shouldHideZeroValues: ComputedRef<boolean>;
  /** Whether to enable editor features (drag-drop, zoom controls, etc.) */
  shouldEnableEditorFeatures: ComputedRef<boolean>;

  // Client-side
  /** Client-side only editor check (guaranteed to be set post-hydration) */
  isInEditorClient: Ref<boolean>;
}
