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

  const handleConfirmLeave = () => {
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

  const route = useRoute();

  const handleLinkClick = (event: MouseEvent) => {
    if (!hasUnsavedChanges()) return;

    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

    event.preventDefault();
    event.stopPropagation();

    const confirmation = window.confirm(confirmMessage);
    if (confirmation) {
      handleConfirmLeave();
      navigateTo(href);
    }
  };

  addRouteMiddleware(
    'unsaved-changes-guard',
    (to) => {
      if (to.path === route.path) return;
      if (!hasUnsavedChanges()) return;

      const confirmation = window.confirm(confirmMessage);
      if (!confirmation) return false;
      handleConfirmLeave();
    },
    { global: true },
  );

  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick, true);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('click', handleLinkClick, true);
  });
};
