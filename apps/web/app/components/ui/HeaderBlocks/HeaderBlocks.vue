<template>
  <div :class="headerBlocksClasses">
    <EditableBlocks v-if="headerBlock" :blocks="[headerBlock]" />
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const initialLocale = nuxtApp.$i18n.locale.value;
const { headerContainerBlock } = useHeaderBlock(initialLocale);
const { updateBlocks } = useBlockTemplates('index', 'immutable', initialLocale);

const headerBlock = computed(() => headerContainerBlock.value);

const headerBlocksClasses = computed(() => [
  'header-blocks',
  { 'sticky top-0 z-50': headerBlock.value?.configuration?.layout?.sticky },
]);

watch(
  () => nuxtApp.$i18n.locale.value,
  async (newLocale) => {
    const { getBlocks, data: newLocaleData } = useBlockTemplates('index', 'immutable', newLocale);
    try {
      await getBlocks('index', 'immutable');
      if (newLocaleData.value.length > 0) {
        updateBlocks(newLocaleData.value);
      }
    } catch (error) {
      console.warn('Failed to fetch blocks for new locale:', error);
    }
  },
);
</script>
