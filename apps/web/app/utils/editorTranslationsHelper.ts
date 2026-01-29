import enTranslations from './editorTranslations.en.json';
import deTranslations from './editorTranslations.de.json';

export const editorTranslations = {
  en: enTranslations,
  de: deTranslations,
};

export const getEditorUITranslation = (key: string, params: Record<string, string | number> = {}): string => {
  const { locale } = useNuxtApp().$i18n;
  const lang = (locale.value as keyof typeof editorTranslations) || 'en';
  let template: string =
    editorTranslations[lang]?.[key as keyof (typeof editorTranslations)['en']] ??
    editorTranslations['en']?.[key as keyof (typeof editorTranslations)['en']] ??
    key;
  Object.entries(params).forEach(([k, v]) => {
    template = template.replace(new RegExp(`{${k}}`, 'g'), String(v));
  });
  return template;
};
