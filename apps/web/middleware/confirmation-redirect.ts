export default defineNuxtRouteMiddleware(async (to) => {
    if (to.query.ak && to.query.id) {
        const lang = to.query.Lang?.toString();
        if (lang) {
            const { defaultLocale, locales, strategy } = useNuxtApp().$i18n;
            const { shouldAddLocalePrefix } = useLocalization();
            const localeCodes = locales.value.map((locale) => locale.code.toString());
            const shouldAddLocale = shouldAddLocalePrefix(strategy, lang, defaultLocale, localeCodes);

            if (shouldAddLocale) {
                return navigateTo(`/${lang}${paths.confirmation}/${to.query.id}/${to.query.ak}`)
            }
        }
        const localePath = useLocalePath();
        return navigateTo(localePath(`${paths.confirmation}/${to.query.id}/${to.query.ak}`));
    }
});
