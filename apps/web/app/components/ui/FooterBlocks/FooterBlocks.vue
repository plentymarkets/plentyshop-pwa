<template>
  <EditableBlocks v-if="!$route.meta.isBlockified && footerBlock" :blocks="[footerBlock]" read-only />
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const route = useRoute();
const { getFooterBlock } = useCategoryTemplate('index', 'immutable', nuxtApp.$i18n.locale.value);
const footerBlock = computed(() => {
  const block = getFooterBlock();
  console.log('[FooterBlocks.vue] getFooterBlock called', {
    route: route.path,
    blockUuid: block?.meta?.uuid,
    content: JSON.stringify(block?.content, null, 2),
  });
  return block;
});
</script>
