<template>
  <div>
    <UiHeader />
    <main
      :class="[
        'mx-auto px-4 pt-4 md:px-0 md:mt-4',
        { 'md:mb-8': heading },
        heading ? 'md:max-w-[630px]' : 'md:max-w-[677px]',
      ]"
    >
      <h1 v-if="heading" class="font-bold mb-10 typography-headline-3 md:typography-headline-2">{{ heading }}</h1>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <UiNavbarBottom v-if="viewport.isLessThan('md')" />
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <NuxtLazyHydrate when-visible>
      <FooterBlock v-if="runtimeConfig.public.isDev && !route.meta.isBlockified" />
      <UiFooter v-if="!runtimeConfig.public.isDev" />
    </NuxtLazyHydrate>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  heading: string;
}>();

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const viewport = useViewport();
</script>
