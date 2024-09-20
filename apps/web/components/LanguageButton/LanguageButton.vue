<template>
  <UiButton
    square
    class="ml-3 mb-2"
    :aria-label="$t(`lang.${locale}`)"
    :data-testid="`languageOption-${locale}`"
    @click="async () => await switchLanguage(locale)"
  >
    <slot />
  </UiButton>
</template>

<script setup lang="ts">
defineProps<{ locale: string }>();
const { switchLocale } = useLocalization();

const switchLanguage = async (locale: string) => {
  await switchLocale(locale);
  window.location.reload();
};
</script>
