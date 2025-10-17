<template>
  <SfTooltip
    :label="getEditorTranslation('tooltip')"
    placement="right"
    class="inline-grid font-editor"
    :show-arrow="true"
  >
    <button
      v-if="runtimeConfig.public.isDev"
      type="button"
      class="editor-button relative py-2 flex justify-center"
      :class="{ 'bg-editor-button text-white rounded-md': active }"
      aria-label="Open general settings drawer"
      data-testid="open-seo-settings-drawer"
    >
      <NuxtImg v-if="active" width="24" height="24px" :src="whiteIcon" />
      <NuxtImg v-else width="24" height="24px" :src="blackIcon" />
    </button>
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import whiteIcon from '~/assets/icons/paths/seo-white.svg';
import blackIcon from '~/assets/icons/paths/seo-black.svg';
const runtimeConfig = useRuntimeConfig();

defineProps({
  active: Boolean,
});
</script>

<i18n lang="json">
{
  "en": {
    "tooltip": "SEO: Manage SEO-relevant settings, like controlling the behaviour of webcrawling robots or defining meta and schema data."
  },
  "de": {
    "tooltip": "SEO: Manage SEO-relevant settings, like controlling the behaviour of webcrawling robots or defining meta and schema data."
  }
}
</i18n>
