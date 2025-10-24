export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp();

  return {
    provide: {
      registerMessages: (msgs: Record<string, Record<string, string>>) => {
        Object.entries(msgs).forEach(([locale, dict]) => {
          $i18n.mergeLocaleMessage(locale, dict);
        });
      },
      dynamicEditorTranslation: (key: string) => {
        const locale = 'en';

        return $i18n.t(key, {}, { locale }) as string;
      },
    },
  };
});
