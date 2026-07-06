<template>
  <node-view-wrapper
    :data-i18n-key="node.attrs.key"
    :title="`i18n: ${tokenTitle}`"
    as="span"
    class="rte-i18n-placeholder"
    contenteditable="false"
  >
    <span class="rte-i18n-placeholder__prefix">i18n</span>
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

<style scoped>
.rte-i18n-placeholder {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 0.8em;
  background: #ecfeff;
  border: 1px solid #67e8f9;
  color: #155e75;
  border-radius: 4px;
  padding: 1px 5px;
  cursor: default;
  user-select: none;
  white-space: nowrap;
}

.rte-i18n-placeholder__prefix {
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
  color: #0e7490;
}
</style>
