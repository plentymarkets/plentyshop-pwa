export interface UseEditorUnsavedChangesGuardOptions {
  enabled?: boolean;
  hasUnsavedChanges?: () => boolean;
  onConfirmLeave?: () => void;
}

/** Guards against accidental navigation away from a page with unsaved editor changes */
export const useEditorUnsavedChangesGuard = (options: UseEditorUnsavedChangesGuardOptions = {}) => {
  const { enabled = true, hasUnsavedChanges: customHasUnsavedChanges, onConfirmLeave } = options;

  if (!enabled) return;

  const { isEditingEnabled } = useEditor();
  const { settingsIsDirty } = useSiteSettings();
  const { closeDrawer } = useSiteConfiguration();
  const { discardChanges } = useBlocks();
  const confirmMessage = getEditorUITranslation('unsaved-changes-confirm');

  const hasUnsavedChanges = customHasUnsavedChanges || (() => isEditingEnabled.value || settingsIsDirty.value);

  const handleBeforeUnload = (event: Event) => {
    if (!hasUnsavedChanges()) return;
    event.preventDefault();
  };

  const handleConfirmLeave = async () => {
    if (isEditingEnabled.value) {
      discardChanges();
      isEditingEnabled.value = false;
    }

    if (onConfirmLeave) {
      onConfirmLeave();
    } else {
      closeDrawer();
    }
  };

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeRouteLeave(async () => {
    if (hasUnsavedChanges()) {
      const confirmation = window.confirm(confirmMessage);

      if (confirmation) {
        await handleConfirmLeave();
        return true;
      } else {
        return false;
      }
    }
  });
};
