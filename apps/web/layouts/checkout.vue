<template>
  <main data-testid="checkout-layout">
    <NuxtLazyHydrate when-visible>
      <NarrowContainer class="px-4 md:px-0 mb-20">
        <div class="flex items-center justify-between mt-8 mb-10 md:px-0">
          <h1 class="font-bold typography-headline-3 md:typography-headline-2 md:pl-4">{{ heading }}</h1>
          <UiButton
            :class="[viewport.isLessThan('lg') ? 'flex lg:hidden whitespace-nowrap' : 'hidden lg:flex']"
            :size="viewport.isLessThan('md') ? 'sm' : 'base'"
            :aria-label="t('prevAriaLabel')"
            data-testid="checkout-back-button"
            variant="tertiary"
            @click="goToPreviousRoute"
          >
            <template #prefix>
              <SfIconArrowBack />
            </template>
            {{ viewport.isLessThan('md') ? backLabelMobile : backLabelDesktop }}
          </UiButton>
        </div>
        <span v-if="isLoading && !cart" class="!flex justify-center my-40 h-24">
          <SfLoaderCircular size="2xl" />
        </span>
        <slot v-else />
      </NarrowContainer>
    </NuxtLazyHydrate>
  </main>
</template>

<script setup lang="ts">
import { SfIconArrowBack, SfLoaderCircular } from '@storefront-ui/vue';
import type { CheckoutLayoutProps } from './types';

const localePath = useLocalePath();
const i18n = useI18n();
const { t } = i18n;
const router = useRouter();
const { isAuthorized } = useCustomer();
const { data: cart, loading: isLoading } = useCart();
const { setInitialData } = useInitialSetup();
const viewport = useViewport();
const { heading, backLabelMobile, backLabelDesktop } = defineProps<CheckoutLayoutProps>();

const currentLocale: string =
  typeof i18n.locale === 'object' && 'value' in i18n.locale
    ? i18n.locale.value
    : (i18n.locale as string);

const availableLocales: string[] = Array.isArray(i18n.availableLocales)
  ? i18n.availableLocales
  : [];

const defaultLocale: string =
  (i18n).defaultLocale || availableLocales[0] || currentLocale;

const getLocaleFromPath = (path?: string): string | null => {
  if (!path) return null;
  const pathname = path.split('?')[0].split('#')[0];
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return null;

  const first = segments[0];
  if (availableLocales.length && availableLocales.includes(first)) {
    return first;
  }
  return defaultLocale;
};

const goToPreviousRoute = () => {
  const backPath = router.options.history.state?.back;
  if (isAuthorized.value && backPath === paths.guestLogin) {
    router.go(-2);
    return;
  }

  if (backPath) {
    const backLocale = getLocaleFromPath(String(backPath));
    if (backLocale && backLocale !== currentLocale) {
      router.push('/');
      return;
    }

    router.back();
    return;
  }

  router.push(localePath(paths.home));
};

onNuxtReady(async () => await setInitialData());
</script>
