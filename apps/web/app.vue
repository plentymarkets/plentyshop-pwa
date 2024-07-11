<template>
  <Body class="font-body" :class="bodyClass" />
  <VitePwaManifest v-if="$pwa?.isPWAInstalled" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
const bodyClass = ref('');
const DAYS = 100;
const localeExpireDate = new Date();
localeExpireDate.setDate(new Date().getDate() + DAYS);
const { getCategoryTree } = useCategoryTree();
const { setInitialDataSSR, ssrLocale } = useInitialSetup();
const route = useRoute();
const { locale } = useI18n();
const vsfLocale = useCookie('vsf-locale', { expires: localeExpireDate });
const { setStaticPageMeta } = useCanonical();
const { isAuthorized } = useCustomer();
const localePath = useLocalePath();

vsfLocale.value = locale.value;
ssrLocale.value = locale.value;

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

const authOnlyRoutes = new Set([
  localePath(paths.accountPersonalData),
  localePath(paths.accountBillingDetails),
  localePath(paths.accountShippingDetails),
  localePath(paths.accountMyOrders),
  localePath(paths.accountMyWishlist),
  localePath(paths.accountReturns),
  localePath(paths.accountNewReturn),
]);

const watchAuthRoutes = (authenticated: boolean) => {
  if (authOnlyRoutes.has(localePath(route.path)) && !authenticated) navigateTo(localePath(paths.home));
};

onNuxtReady(async () => {
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
  await setInitialDataSSR();
  watchAuthRoutes(isAuthorized.value);
});

watch(
  () => isAuthorized.value,
  (authenticated: boolean) => watchAuthRoutes(authenticated),
);

watch(
  () => locale.value,
  async (locale: string) => {
    vsfLocale.value = locale;

    await getCategoryTree();
  },
);
</script>
