<template>
  <div class="p-4 flex" :style="productLegalInlineStyle" data-testid="legal-information">
    <p class="font-bold leading-6 cursor-pointer" data-testid="open-manufacturer-drawer" @click="openDrawer(meta.uuid)">
      <span data-testid="link-text">{{ props.content.text.linkText }}</span>
      <SfIconChevronRight />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { SfIconChevronRight } from '@storefront-ui/vue';
import type { ProductLegalInformationProps } from './types';
const props = defineProps<ProductLegalInformationProps>();
const { meta } = props;

const { openDrawer } = useProductLegalDetailsDrawer();

const productLegalInlineStyle = computed(() => {
  const layout = props.content.layout ?? {};
  return {
    paddingTop: `${layout.paddingTop ?? 0}px`,
    paddingBottom: `${layout.paddingBottom ?? 0}px`,
    paddingLeft: `${layout.paddingLeft ?? 0}px`,
    paddingRight: `${layout.paddingRight ?? 0}px`,
  };
});
</script>
