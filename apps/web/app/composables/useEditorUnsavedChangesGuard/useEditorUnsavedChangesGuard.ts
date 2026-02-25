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
  const confirmMessage = getEditorUITranslation('unsaved-changes-confirm');

  const hasUnsavedChanges = customHasUnsavedChanges || (() => !isEditingEnabled.value && !settingsIsDirty.value);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges()) return;
    event.preventDefault();
  };

  const handleConfirmLeave = () => {
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

  onBeforeRouteLeave((to, from, next) => {
    if (isEditingEnabled.value) {
      const confirmation = window.confirm(confirmMessage);
      if (confirmation) {
        handleConfirmLeave();
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  });
};
