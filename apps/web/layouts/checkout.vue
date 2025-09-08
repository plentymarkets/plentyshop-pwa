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
const { t, locale } = useI18n();
const router = useRouter();
const { isAuthorized } = useCustomer();
const { data: cart, loading: isLoading } = useCart();
const { setInitialData } = useInitialSetup();
const viewport = useViewport();
const { heading, backLabelMobile, backLabelDesktop } = defineProps<CheckoutLayoutProps>();
const goToPreviousRoute = () => {
  const backPath = router.options.history.state?.back;
  const currentLocale = locale.value;
  const getLocaleFromPath = (path: string) => {
    const match = path.match(/^\/([a-zA-Z-]{2,5})(\/|$)/);
    return match ? match[1] : null;
  };

  if (isAuthorized.value && backPath === paths.guestLogin) {
    router.go(-2);
    return;
  }

  if (backPath) {
    const backLocale = getLocaleFromPath(String(backPath));
    if (backLocale && backLocale !== currentLocale) {
      router.push(localePath(paths.home));
      return;
    }

    router.back();
    return;
  }

  router.push(localePath(paths.home));
};

onNuxtReady(async () => await setInitialData());
</script>
