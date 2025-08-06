export default defineNuxtPlugin(() => {
  return {
    provide: {
      registerMessages: (msgs: Record<string, Record<string, string>>) => {
        const { $i18n } = useNuxtApp()

        Object.entries(msgs).forEach(([locale, dict]) => {
          $i18n.mergeLocaleMessage(locale, dict)
        })
      }
    }
  }
})

