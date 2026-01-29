import type { UseEditorStateReturn } from './types';

/**
 * @description Composable for managing editor state conditions
 * Centralizes all `$isPreview` logic into semantic, well-named computed properties
 * @returns UseEditorStateReturn - Editor state properties and feature flags
 * @example
 * ``` ts
 * const { isEditMode, shouldUseFakeData } = useEditorState();
 * if (shouldUseFakeData.value) {
 *   // Use fake data for editor
 * }
 * ```
 */
export const useEditorState = (): UseEditorStateReturn => {
  const { $isPreview } = useNuxtApp();
  const { disableActions } = useEditor();

  /** @description Whether we are in the editor environment (true in both edit and preview modes) */
  const isInEditor = computed(() => !!$isPreview);

  /** @description Whether we are in edit mode (can modify blocks, shows editor UI, uses fake data) */
  const isEditMode = computed(() => !!$isPreview && disableActions.value);

  /** @description Whether we are in preview mode (viewing changes without editing) */
  const isPreviewMode = computed(() => !!$isPreview && !disableActions.value);

  /** @description Whether we are in live/production mode (no editor features) */
  const isLiveMode = computed(() => !$isPreview);

  /** @description Whether to show editor UI elements (toolbars, overlays, etc.) */
  const shouldShowEditorUI = computed(() => isEditMode.value);

  /** @description Whether to enable editor features (drag-drop, zoom controls, etc.) */
  const shouldEnableEditorFeatures = computed(() => isEditMode.value);

  /** @description Whether to use fake/example data instead of real API data */
  const shouldUseFakeData = computed(() => isEditMode.value);

  /** @description Whether to hide zero/empty values in displays */
  const shouldHideZeroValues = computed(() => isPreviewMode.value || isLiveMode.value);

  /** @description Client-side only editor check (guaranteed to be set post-hydration) */
  const isInEditorClient = ref(false);
  onNuxtReady(() => {
    isInEditorClient.value = !!$isPreview;
  });

  return {
    isInEditor,
    isEditMode,
    isPreviewMode,
    isLiveMode,

    shouldShowEditorUI,
    shouldUseFakeData,
    shouldHideZeroValues,
    shouldEnableEditorFeatures,

    isInEditorClient,
  };
};
