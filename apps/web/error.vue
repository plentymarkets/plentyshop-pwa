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

<script setup>
const props = defineProps(['error']);
const { t } = useI18n();
const { setInitialDataSSR } = useInitialSetup();

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
</script>
