<template>
  <div data-testid="header-container">
    <div v-for="section in enabledSections" :key="section.identifier" :data-header-section="section.identifier">
      <EditableBlocks :identifier="section.identifier" :type="section.type" prevent-route-guard />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderContainerProps } from '~/components/blocks/structure/HeaderContainer/types';

const { block } = defineProps<HeaderContainerProps>();

const enabledSections = computed(() =>
  [...block.content.sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order),
);

const locale = useNuxtApp().$i18n.locale.value;
const {
  setDefaultTemplate,
  data: headerData,
  cleanData: headerCleanData,
} = useBlockTemplates('header', 'header', locale);
setDefaultTemplate(createHeaderSection());

const { isEditingEnabled } = useEditor();
watch(headerData, () => (isEditingEnabled.value = !deepEqual(headerCleanData.value, headerData.value)), { deep: true });
</script>
