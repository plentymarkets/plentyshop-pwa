<template>
  <SfButton
    square
    class="ml-3 mb-2"
    :aria-label="$t(`lang.${locale}`)"
    :data-testid="`languageOption-${locale}`"
    @click="async () => await switchLocale(locale)"
  >
    <slot />
  </SfButton>
</template>

<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';
defineProps<{ locale: string }>();
const { switchLocale } = useLocalization();
</script>
