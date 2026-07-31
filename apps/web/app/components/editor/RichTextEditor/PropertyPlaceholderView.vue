<template>
  <node-view-wrapper
    :data-property-token="node.attrs.token"
    :title="tokenLabel"
    as="span"
    class="rte-property-placeholder"
    contenteditable="false"
  >
    {{ tokenLabel }}
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';

const props = defineProps(nodeViewProps);
const tokenLabel = computed(() => getPropertyPlaceholderDisplayLabel(props.node.attrs.token, props.node.attrs.label));
</script>

<style scoped>
.rte-property-placeholder {
  display: inline-flex;
  align-items: center;
  font-family: monospace;
  font-size: 0.8em;
  background: #1750aa;
  border: 1px solid #d8b4fe;
  color: #ffffff;
  border-radius: 4px;
  padding: 1px 5px;
  cursor: default;
  user-select: none;
  white-space: nowrap;
}
</style>
