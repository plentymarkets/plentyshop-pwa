import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

/**
 * Composable to handle navigation guard for unsaved changes in editor
 * Provides a reusable route leave guard that prompts users when they have unsaved edits
 */
export const useEditorUnsavedChangesGuard = () => {
  const { closeDrawer } = useSiteConfiguration();
  const { isEditingEnabled } = useEditor();
  const { settingsIsDirty } = useSiteSettings();

  const hasUnsavedChanges = computed(() => isEditingEnabled.value || settingsIsDirty.value);

  const guardRouteLeave = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (hasUnsavedChanges.value) {
      const confirmation = window.confirm('You have unsaved changes. Are you sure you want to leave?');

      if (confirmation) {
        closeDrawer();
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  };

  return {
    hasUnsavedChanges,
    guardRouteLeave,
  };
};
