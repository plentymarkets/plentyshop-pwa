<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const DAYS = 100;
const route = useRoute();
const { locale } = useI18n();
const localeExpireDate = new Date();
localeExpireDate.setDate(new Date().getDate() + DAYS);
const bodyClass = ref('');

onMounted(() => {
  const { setInitialDataSSR, ssrLocale } = useInitialSetup();
  setInitialDataSSR();
  ssrLocale.value = locale.value;
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

const vsfLocale = useCookie('vsf-locale', {
  expires: localeExpireDate,
});
const { setStaticPageMeta } = useCanonical();

vsfLocale.value = locale.value;

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

watch(
  () => locale.value,
  async (locale: string) => {
    vsfLocale.value = locale;
    const { getCategoryTree } = useCategoryTree();
    getCategoryTree();
  },
);
</script>
