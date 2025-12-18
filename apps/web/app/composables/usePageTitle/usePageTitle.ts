/**
 * Composable for setting the page title.
 * Used in layouts. Title can be changed in pages through the `useHead` composable.
 */
import { metaDefaults, openGraph } from '~/configuration/app.config';

export const usePageTitle = () => {
  const runtimeConfig = useRuntimeConfig().public;

  const { getSetting: getMetaTitle } = useSiteSettings('metaTitle');
  const { getSetting: getOgTitle } = useSiteSettings('ogTitle');

  const defaultTitle = computed(() => getMetaTitle() || runtimeConfig.metaTitle || metaDefaults.title);

  const titleSuffix = computed(() => getOgTitle() || runtimeConfig.ogTitle || openGraph.title);

  useHead({
    titleTemplate: (titleChunk) => {
      if (titleChunk) {
        return `${titleChunk} | ${titleSuffix.value}`;
      }

      return `${defaultTitle.value} | ${titleSuffix.value}`;
    },
  });
};
