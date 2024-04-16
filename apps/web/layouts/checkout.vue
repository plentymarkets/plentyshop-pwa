<template>
  <main data-testid="checkout-layout">
    <NuxtLazyHydrate when-visible>
      <NarrowContainer class="px-4 md:px-0 mb-20">
        <div class="flex items-center justify-between mt-8 mb-10 px-4 md:px-0">
          <h1 class="font-bold typography-headline-3 md:typography-headline-2">{{ layoutProps['heading'] }}</h1>
          <SfButton
            :tag="NuxtLink"
            :to="localePath(String(layoutProps['back-href']))"
            :class="[viewport.isLessThan('md') ? 'flex md:hidden whitespace-nowrap' : 'hidden md:flex']"
            :size="viewport.isLessThan('md') ? 'sm' : 'base'"
            variant="tertiary"
          >
            <template #prefix>
              <SfIconArrowBack />
            </template>
            {{ viewport.isLessThan('md') ? layoutProps['back-label-mobile'] : layoutProps['back-label-desktop'] }}
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

const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const { data: cart, loading: isLoading } = useCart();
const { setInitialData } = useInitialSetup();
const viewport = useViewport();
const layoutProps = useAttrs();

setInitialData();
</script>
