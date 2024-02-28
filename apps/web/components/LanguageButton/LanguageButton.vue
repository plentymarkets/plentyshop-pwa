<template>
  <SfButton
    square
    class="ml-3 mb-2"
    :aria-label="t(`lang.${locale}`)"
    :data-testid="`languageOption-${locale}`"
    @click="switchLocale(locale)"
  >
    <slot />
  </SfButton>
</template>
<script setup lang="ts">
import { SfButton } from '@storefront-ui/vue';

defineProps<{
  locale: string;
}>();

const { t } = useI18n();
const { setLocaleCookie } = useI18n();
const route = useRoute();
const switchLocalePath = useSwitchLocalePath();
const { toggle } = useLanguageSelect();

const switchLocale = (language: string) => {
  setLocaleCookie(language);
  navigateTo({ path: switchLocalePath(language), query: route.query });
  toggle();
};
</script>
