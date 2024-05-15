<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { setInitialDataSSR, ssrLocale } = useInitialSetup();
const DAYS = 100;
const { getCategoryTree } = useCategoryTree();
const route = useRoute();
const { locale } = useI18n();
const localeExpireDate = new Date();
localeExpireDate.setDate(new Date().getDate() + DAYS);
const bodyClass = ref('');

onMounted(() => {
  setInitialDataSSR();
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

const vsfLocale = useCookie('vsf-locale', {
  expires: localeExpireDate,
});
const { setStaticPageMeta } = useCanonical();

vsfLocale.value = locale.value;
ssrLocale.value = locale.value;

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

watch(
  () => locale.value,
  async (locale: string) => {
    vsfLocale.value = locale;

    await getCategoryTree();
  },
);
</script>
