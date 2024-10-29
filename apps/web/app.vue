<template>
  <Body class="font-body" :class="bodyClass" />
  <UiNotifications />
  <VitePwaManifest v-if="$pwa?.isPWAInstalled" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
const bodyClass = ref('');
const { getCategoryTree } = useCategoryTree();
const { setInitialDataSSR } = useInitialSetup();
const { setVsfLocale } = useLocalization();
const route = useRoute();
const { locale } = useI18n();
const { setStaticPageMeta } = useCanonical();
const { isAuthorized } = useCustomer();
const localePath = useLocalePath();

await setInitialDataSSR();
setVsfLocale(locale.value);

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
  watchAuthRoutes(isAuthorized.value);
});

watch(
  () => isAuthorized.value,
  (authenticated: boolean) => watchAuthRoutes(authenticated),
);

watch(
  () => locale.value,
  async (locale: string) => {
    setVsfLocale(locale);
    await getCategoryTree();
  },
);

watch(
  () => route.query,
  (query) => {
    if (query.ActionCall === 'WebActionConfirmNewsletter') {
      // eslint-disable-next-line no-unused-vars
      const { ActionCall, ...theRestQuery } = query;
      navigateTo({ path: paths.emailConfirmation, query: theRestQuery });
    }
  },
  { immediate: true },
);
</script>
