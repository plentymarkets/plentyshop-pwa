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
    <Cookiebar />
    <LazyUiNavbarBottom v-if="viewport.isLessThan('md')" />
    <LazyPreviewMode  hydrate-on-idle />
    <LazyUiFooter  hydrate-on-visible/>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  heading: string;
}>();

const viewport = useViewport();
</script>
