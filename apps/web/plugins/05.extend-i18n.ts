export default defineNuxtPlugin(() => {
  return {
    provide: {
      registerMessages: (msgs: Record<string, Record<string, string>>) => {
        const { $i18n } = useNuxtApp();

        Object.entries(msgs).forEach(([locale, dict]) => {
          $i18n.mergeLocaleMessage(locale, dict);
        });
      },
      dynamicEditorTranslation: (key: string) => {
        const locale = 'en';

        const { $i18n } = useNuxtApp();

        return $i18n.t(key, {}, { locale }) as string;
      },
    },
  };
});
