export const useToolbar = () => {
  const { isEditingEnabled } = useEditor();
  const { send } = useNotification();

  const { settingsIsDirty, dirtyKeys, saveSiteSettings } = useSiteSettings();
  const { assetsIsDirty, saveCustomAssets } = useCustomAssets();
  const { updatePageTemplate } = useUpdatePageTemplate();
  const { data: dataProduct } = useProducts();
  const route = useRoute();
  const save = async () => {
    const messageList: string[] = [];
    let hasError = false;
    let saved = null;

    const handleSave = async (saveFunction: () => Promise<boolean>, successMessage?: string) => {
      saved = await saveFunction();

      if (saved) {
        if (successMessage) {
          messageList.push(successMessage);
        }
      } else {
        hasError = true;
      }
    };

    if (isEditingEnabled.value) {
      await handleSave(updatePageTemplate);
    }

    const { hasChanges: localizationHasChanges, saveLocalizations } = useEditorLocalizationKeys();
    if (localizationHasChanges.value) await saveLocalizations();

    if (settingsIsDirty.value) {
      const touchedFont = dirtyKeys.value.includes('font');

      await handleSave(saveSiteSettings, touchedFont ? getEditorUITranslation('settings') : undefined);
    }

    if (assetsIsDirty.value) {
      await handleSave(saveCustomAssets);
    }

    if (saved && !hasError) {
      send({
        message: [getEditorUITranslation('toolbarSuccess'), ...messageList],
        type: 'positive',
      });
      if (import.meta.client) {
        window.dispatchEvent(new CustomEvent('footer-block-refetch'));
      }
    }

    if (hasError) {
      send({
        message: getEditorUITranslation('toolbarError'),
        type: 'negative',
      });
    }
  };
  const isEditablePage = computed(() => {
    return route.path === '/' || dataProduct.value.category?.type === 'content';
  });

  return { save, isEditablePage };
};
