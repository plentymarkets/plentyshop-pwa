<template>
  <section data-testid="category-empty-state" class="flex flex-col items-center md:mt-16">
    <NuxtImg
      src="/_nuxt-plenty/images/something-went-wrong.svg"
      :alt="t('emptyStateAltText')"
      width="192"
      height="192"
      loading="lazy"
    />
    <p class="mt-8 font-medium">{{ t('emptyStateText') }}</p>
    <p class="mt-4">{{ t('emptyStateText2') }}</p>
    <UiButton :tag="NuxtLink" :to="localePath(paths.category)" variant="secondary" class="mt-4">
      {{ t('allProductsLinkText') }}
    </UiButton>
  </section>
</template>

<script setup lang="ts">
import { paths } from '~/utils/paths';

const localePath = useLocalePath();
const { t } = useI18n();
const NuxtLink = resolveComponent('NuxtLink');
</script>
