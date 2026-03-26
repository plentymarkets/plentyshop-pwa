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
  const locale = useNuxtApp().$i18n.locale.value;
  const { resetHeaderToSaved } = useHeaderBlock(locale);
  const { resetFooterToSaved } = useFooterBlock(locale);
  const confirmMessage = getEditorUITranslation('unsaved-changes-confirm');

  const hasUnsavedChanges = customHasUnsavedChanges || (() => isEditingEnabled.value || settingsIsDirty.value);

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
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

  onBeforeRouteLeave(async (to, from, next) => {
    if (hasUnsavedChanges()) {
      const confirmation = window.confirm(confirmMessage);

      if (confirmation) {
        await handleConfirmLeave();
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  });
};
