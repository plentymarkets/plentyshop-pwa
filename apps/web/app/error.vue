<template>
  <NuxtLayout name="default">
    <Error404Content v-if="error && error.statusCode == 404" />
    <div v-else class="my-8 flex items-center justify-center p-4">
      <div class="w-full text-center">
        <h1 class="text-3xl md:text-4xl font-semibold mb-4">{{ error.statusCode }} - {{ t('error.errorOccured') }}</h1>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';
import { paths } from '~/utils/paths';

interface ErrorProp {
  statusCode: number;
  statusMessage: string;
  [key: string]: unknown;
}
const props = defineProps<{ error: ErrorProp }>();
const localePath = useLocalePath();
const { setInitialDataSSR } = useInitialSetup();
const { data: categoryTree } = useCategoryTree();
const { buildCategoryMenuLink } = useLocalization();
const { getSetting: getHomepageCategoryId } = useSiteSettings('homepageCategoryId');

const findCategoryById = (items: CategoryTreeItem[], targetId: number): CategoryTreeItem | null => {
  for (const item of items) {
    if (categoryTreeGetters.getId(item) === targetId) {
      return item;
    }

    if (item.children?.length) {
      const found = findCategoryById(item.children, targetId);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

const getHomepageRedirectPath = () => {
  const homepageCategoryId = Number(getHomepageCategoryId());

  if (!Number.isNaN(homepageCategoryId) && homepageCategoryId > 0 && categoryTree.value.length) {
    const homepageCategory = findCategoryById(categoryTree.value, homepageCategoryId);
    if (homepageCategory) {
      return localePath(buildCategoryMenuLink(homepageCategory, categoryTree.value));
    }
  }

  return localePath(paths.home);
};

const { getSetting: getFavicon } = useSiteSettings('favicon');
const { getSetting: getOgTitle } = useSiteSettings('ogTitle');
const { getSetting: getOgImage } = useSiteSettings('ogImage');
const { getSetting: getMetaDescription } = useSiteSettings('metaDescription');
const { getSetting: getMetaKeywords } = useSiteSettings('metaKeywords');
const { getSetting: getRobots } = useSiteSettings('robots');
const { getSetting: getPrimaryColor } = useSiteSettings('primaryColor');

const ogTitle = ref(getOgTitle());
const ogImage = ref(getOgImage());
const description = ref(getMetaDescription());
const keywords = ref(getMetaKeywords());
const robots = ref(getRobots());
const fav = ref(getFavicon());
const themeColor = ref(getPrimaryColor());

watchEffect(() => {
  ogTitle.value = getOgTitle();
  ogImage.value = getOgImage();
  description.value = getMetaDescription();
  keywords.value = getMetaKeywords();
  robots.value = getRobots();
  fav.value = getFavicon();
  themeColor.value = getPrimaryColor();
});

useSeoMeta({
  title: `${props.error.statusCode} - ${props.error.statusCode === 404 ? t('error.pageNotFound') : t('error.errorPlain')}`,
  ogTitle: () => ogTitle.value,
  ogImage: () => ogImage.value,
  description: () => description.value,
  keywords: () => keywords.value,
  robots: () => robots.value,
  themeColor: () => themeColor.value,
  generator: 'plentymarkets',
});

useHead({
  link: () => [
    { rel: 'icon', href: fav.value },
    { rel: 'apple-touch-icon', href: fav.value },
  ],
});

await callOnce(async () => {
  await setInitialDataSSR();
});

if (props.error.statusCode === 404) {
  const redirectPath = getHomepageRedirectPath();

  if (import.meta.client) {
    window.location.replace(redirectPath);
  } else {
    await clearError({ redirect: redirectPath });
  }
}
</script>

<style lang="scss">
@use '~/assets/style.scss';
</style>
