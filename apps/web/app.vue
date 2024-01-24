<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const bodyClass = ref('');
const DAYS = 100;
const localeExpireDate = new Date();
localeExpireDate.setDate(new Date().getDate() + DAYS);

onMounted(() => {
  // Need this class for cypress testing
  bodyClass.value = 'hydrated';
});

const { getCategoryTree } = useCategoryTree();
const { setInitialDataSSR, ssrLocale } = useInitialSetup();
const route = useRoute();
const { locale } = useI18n();

const vsfLocale = useCookie('vsf-locale', {
  expires: localeExpireDate,
});
const { setStaticPageMeta } = useCanonical();

vsfLocale.value = locale.value;
ssrLocale.value = locale.value;

await setInitialDataSSR();

if (route?.meta.pageType === 'static') {
  setStaticPageMeta();
}
usePageTitle();

watch(
  () => locale.value,
  async (locale: string) => {
    vsfLocale.value = locale;

    await getCategoryTree();
  },
);
</script>
