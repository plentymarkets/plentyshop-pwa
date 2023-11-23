<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const bodyClass = ref('');

onMounted(() => {
  // Need this class for cypress testing
  bodyClass.value = 'hydrated';
});

const { getCategoryTree } = useCategoryTree();
const { setInitialData, ssrLocale } = useInitialSetup();
const route = useRoute();
const { locale } = useI18n();
const vsfLocale = useCookie('vsf-locale');
const { setStaticPageMeta } = useCanonical();

vsfLocale.value = locale.value;
ssrLocale.value = locale.value;

if (route?.meta.layoutName !== 'checkout') {
  await setInitialData();
}

if (route?.meta.pageType === 'static') {
  setStaticPageMeta();
}

await getCategoryTree();
usePageTitle();

watch(
  () => locale.value,
  async (locale: any) => {
    vsfLocale.value = locale;

    await getCategoryTree();
  },
);
</script>
