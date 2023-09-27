<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { getCategoryTree } = useCategoryTree();
const { setInitialData } = useInitialSetup();
const route = useRoute();
const { locale } = useI18n();
const vsfLocale = useCookie('vsf-locale');

vsfLocale.value = locale.value;

if (route?.meta.layoutName !== 'checkout') {
  setInitialData();
}

getCategoryTree();
usePageTitle();

const bodyClass = ref('');
onMounted(() => {
  // Need this class for cypress testing
  bodyClass.value = 'hydrated';
});

watch(
  () => locale.value,
  async (locale: any) => {
    vsfLocale.value = locale;

    await getCategoryTree();
  },
);
</script>
