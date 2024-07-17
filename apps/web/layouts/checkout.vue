<template>
  <main data-testid="checkout-layout">
    <NuxtLazyHydrate when-visible>
      <NarrowContainer class="px-4 md:px-0 mb-20">
        <div class="flex items-center justify-between mt-8 mb-10 px-4 md:px-0">
          <h1 class="font-bold typography-headline-3 md:typography-headline-2">{{ heading }}</h1>
          <SfButton
            @click="goToPreviousRoute"
            :class="[viewport.isLessThan('md') ? 'flex md:hidden whitespace-nowrap' : 'hidden md:flex']"
            :size="viewport.isLessThan('md') ? 'sm' : 'base'"
            :aria-label="$t('prevAriaLabel')"
            variant="tertiary"
          >
            <template #prefix>
              <SfIconArrowBack />
            </template>
            {{ viewport.isLessThan('md') ? backLabelMobile : backLabelDesktop }}
          </SfButton>
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
import { SfButton, SfIconArrowBack, SfLoaderCircular } from '@storefront-ui/vue';
import { CheckoutLayoutProps } from './types';

const localePath = useLocalePath();
const router = useRouter();
const { data: cart, loading: isLoading } = useCart();
const { setInitialData } = useInitialSetup();
const viewport = useViewport();
const { backToCart, heading, backLabelMobile, backLabelDesktop } = withDefaults(defineProps<CheckoutLayoutProps>(), {
  backToCart: true,
});
const historyState = router.options.history.state;
const backUrl = localePath(historyState?.back?.toString() ?? paths.home);
const backHref = backUrl === localePath(router.currentRoute.value.path) ? localePath(paths.home) : backUrl;
const goToPreviousRoute = () => (backToCart ? navigateTo(localePath(paths.cart)) : navigateTo(localePath(backHref)));

onNuxtReady(() => setInitialData());
</script>
