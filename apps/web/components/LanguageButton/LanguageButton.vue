<template>
  <UiButton
    square
    class="ml-3 mb-2"
    :aria-label="$t(`lang.${locale}`)"
    :data-testid="`languageOption-${locale}`"
    @click="async () => await switchLocale(locale)"
  >
    <slot />
  </UiButton>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

defineProps<{ locale: Locale }>();
const { switchLocale } = useLocalization();
</script>
