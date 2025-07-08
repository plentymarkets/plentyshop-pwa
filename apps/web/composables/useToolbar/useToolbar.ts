import type { FooterSettings } from '~/components/blocks/Footer/types';

export const useToolbar = () => {
  const { isEditingEnabled } = useEditor();
  const { send } = useNotification();
  const { $i18n } = useNuxtApp();

  const { saveSettings, settingsIsDirty } = useSiteConfiguration();
  const { updatePageTemplate } = useUpdatePageTemplate();
  const { data: dataProduct } = useProducts();
  const route = useRoute();
  const save = async () => {
    const messageList: string[] = [];
    let hasError = false;
    let saved = null;
    const errorMessage = $i18n.t('errorMessages.editor.save.error');

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

    if (settingsIsDirty.value) {
      await handleSave(saveSettings, $i18n.t('errorMessages.editor.save.settings'));
    }

    if (saved && !hasError) {
      send({
        message: [$i18n.t('errorMessages.editor.save.success'), ...messageList],
        type: 'positive',
      });

    }

    if (hasError) {
      send({
        message: errorMessage,
        type: 'negative',
      });
    }
  };
  const isEditablePage = computed(() => {
    return route.path === '/' || dataProduct.value.category?.type === 'content';
  });

  function refreshFooterBlockCache(cachedFooter: Ref<FooterSettings | null>) {
    cachedFooter.value = null;
  }

  return { save, isEditablePage, refreshFooterBlockCache };
};
