export const editorTranslations = {
  en: {
    deleteError: "The page {pageName} (category ID: {id}) couldn't be deleted. {errorMessage}",
    deleteSuccess: 'The page {pageName} (category ID: {id}) has been deleted.',
    error: 'Error saving categories.',
    success: 'Categories saved successfully.',
    settings: 'For settings changes to take effect, update your shop.',
    toolbarError:
      "The changes couldn't be saved. Your session may have expired. Re-enter the editor to start a new session.",
    toolbarSuccess: 'Your changes have been saved.',
  },
  de: {
    deleteError: 'Die Seite {pageName} (Kategorie-ID: {id}) konnte nicht gelöscht werden. {errorMessage}',
    deleteSuccess: 'Die Seite {pageName} (Kategorie-ID: {id}) wurde gelöscht.',
    error: 'Fehler beim Speichern der Kategorien.',
    success: 'Kategorien erfolgreich gespeichert.',
    settings: 'Um Änderungen an den Einstellungen anzuwenden, aktualisiere deinen Shop.',
    toolbarError:
      'Die Änderungen konnten nicht gespeichert werden. Falls die aktuelle Sitzung abgelaufen ist, starte eine neue Sitzung. Öffne dazu den Editor erneut.',
    toolbarSuccess: 'Die Änderungen wurden gespeichert.',
  },
};

export const getEditorTranslationForComposable = (
  key: keyof (typeof editorTranslations)['en'],
  params: Record<string, string | number> = {},
): string => {
  const { locale } = useI18n();
  const lang = (locale.value as keyof typeof editorTranslations) || 'en';
  let template: string = editorTranslations[lang]?.[key] ?? editorTranslations['en']?.[key] ?? '';
  Object.entries(params).forEach(([k, v]) => {
    template = template.replace(new RegExp(`{${k}}`, 'g'), String(v));
  });
  return template;
};
