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
<style>
#__nuxt > div > div.w-full.h-full.z-50.md\:sticky.md\:shadow-md > header > div{
  background:red;
}

#__nuxt > div > main > div.max-w-screen-3xl.mx-auto.md\:px-6.lg\:px-10 > div.flex.flex-col.md\:flex-row.flex-wrap.gap-6.mt-max-w-\[1540px\] > div.relative.flex.md\:max-w-\[1536px\].md\:\[\&\:not\(\:first-of-type\)\]\:flex-1.md\:first-of-type\:w-full.bg-negative-200{
  background:red;
}

#__nuxt > div > div.w-full.bg-white.items-center.py-10.justify-center.flex.top-\[10\%\]{
  background: red;
}

#__nuxt > div > main > div.max-w-screen-3xl.mx-auto.md\:px-6.lg\:px-10 > div.flex.flex-wrap.gap-4.lg\:gap-6.lg\:flex-no-wrap.justify-center.my-10{
  background: red;
}
</style>
