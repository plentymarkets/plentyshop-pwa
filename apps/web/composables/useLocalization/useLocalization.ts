import { createSharedComposable } from '@vueuse/core';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';
import { categoryTreeGetters } from '@plentymarkets/shop-sdk';
export const useLocalization = createSharedComposable(() => {
    const isOpen = ref(false);
    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    /**
     * 
     * @param path category path that is provided by the category response to redirect after a language switch
     * @returns category path that is then navigated to
     */
    const buildCategoryLanguagePath = (path: string) => {
        const localePath = useLocalePath();

        return localePath(path);
    }

    /**
     * 
     * @param path product path that is provided by the product response to redirect after a language switch
     * @returns product path that is then navigated to
     */
    const buildProductLanguagePath = (path: string) => {
        const localePath = useLocalePath();

        return localePath(path);
    }

    /**
     * Used to generate the category path inside the mega menu and other navigation trees.
     * @param category
     * @param categoryTree
     * @returns product path that is then navigated to
     */
    const buildCategoryMenuLink = (category: CategoryTreeItem, categoryTree: CategoryTreeItem[]) => {
        return categoryTreeGetters.generateCategoryLink(categoryTree, category, '');
    };

    const getCategoryUrlFromRoute = (path: string): string => {

        const parts = path.split('/');

        const { locale, defaultLocale, strategy } = useNuxtApp().$i18n as any;

        const shouldRemoveLocale = (strategy: string, locale: string, defaultLocale: string) => {
            if (strategy === 'prefix') {
                return true;
            }

            if (strategy === 'prefix_except_default') {
                return locale !== defaultLocale;
            }

            if (strategy === 'prefix_and_default') {
                return locale !== defaultLocale || parts[1] === locale;
            }

            return false;
        };

        if (shouldRemoveLocale(strategy, locale.value, defaultLocale)) {
            const localeIndex = parts.indexOf(locale.value);
            if (localeIndex !== -1) {
                parts.splice(localeIndex, 1);
            }
        }

        return parts.map((part) => (part.includes('?') ? part.split('?')[0] : part)).join('/');
    };


    const switchLocale = (language: string) => {
        const { setLocaleCookie } = useNuxtApp().$i18n as any;
        const switchLocalePath = useSwitchLocalePath();
        const router = useRouter();
        const route = useRoute();
        setLocaleCookie(language);
        router.push({ path: switchLocalePath(language), query: route.query });
        toggle();
    };

    return {
        getCategoryUrlFromRoute,
        buildCategoryMenuLink,
        buildCategoryLanguagePath,
        buildProductLanguagePath,
        isOpen,
        toggle,
        switchLocale
    }
});