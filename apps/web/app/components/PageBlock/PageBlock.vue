<template>
  <div v-if="block.meta" :key="block.meta.uuid" :data-uuid="block.meta.uuid" class="h-full">
    <PageBlockContent
      :index="index"
      :block="block"
      :root="root"
      :enable-actions="enableActions"
      :content-attrs="attrs"
      :recursive-component="PageBlock"
      wrapper-class="relative block-wrapper h-full"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PageBlockProps } from './types';
import PageBlockContent from './PageBlockContent.vue';

withDefaults(defineProps<PageBlockProps>(), {
  enableActions: false,
});

const attrs = useAttrs();
const PageBlock = getCurrentInstance()!.type;
</script>
