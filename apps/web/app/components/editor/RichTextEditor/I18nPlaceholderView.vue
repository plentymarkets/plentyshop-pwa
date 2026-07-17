<template>
  <node-view-wrapper
    :data-i18n-key="node.attrs.key"
    :title="`i18n: ${tokenTitle}`"
    as="span"
    class="rte-i18n-placeholder inline-flex items-center gap-1 rounded border border-[#67e8f9] bg-[#ecfeff] px-[5px] py-px font-mono text-[0.8em] text-[#155e75] cursor-default select-none whitespace-nowrap"
    contenteditable="false"
  >
    <span class="text-[0.72em] font-bold tracking-normal text-[#0e7490] uppercase">i18n</span>
    <span>{{ tokenLabel }}</span>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { getI18nPlaceholderDisplayLabel, getI18nPlaceholderTitle } from '~/utils/i18nPlaceholders';

const props = defineProps(nodeViewProps);
const tokenLabel = computed(() => getI18nPlaceholderDisplayLabel(props.node.attrs.key, props.node.attrs.label));
const tokenTitle = computed(() => getI18nPlaceholderTitle(props.node.attrs.key, props.node.attrs.label));
</script>
