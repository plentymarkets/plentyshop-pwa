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
  const route = useRoute();
  const { resetFooterToSaved, resetHeaderToSaved } = useBlockTemplates(
    (route.meta.identifier as string) ?? 'unknown',
    (route.meta.type as string) ?? 'unknown',
    useNuxtApp().$i18n.locale.value,
  );
  const confirmMessage = getEditorUITranslation('unsaved-changes-confirm');

  const hasUnsavedChanges = customHasUnsavedChanges || (() => isEditingEnabled.value || settingsIsDirty.value);

  const handleBeforeUnload = (event: Event) => {
    if (!hasUnsavedChanges()) return;
    event.preventDefault();
  };

  const handleConfirmLeave = async () => {
    if (isEditingEnabled.value) {
      await Promise.all([resetHeaderToSaved(), resetFooterToSaved()]);
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
