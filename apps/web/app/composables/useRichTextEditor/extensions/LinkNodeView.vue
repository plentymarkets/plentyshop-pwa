<template>
  <NodeViewWrapper as="span" class="custom-link-node-view">
    <span class="inline-block rounded border border-blue-400 bg-blue-100 px-1.5 py-0.5 text-sm">
      <span class="space-x-1">
        <span class="font-mono text-xs text-blue-600">link</span>
        <span class="text-blue-900">{{ node.attrs.label }}</span>
      </span>

      <div class="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 z-10 min-w-64 space-y-1 text-xs whitespace-nowrap">
        <div class="font-semibold text-gray-700">Edit Link</div>
        
        <label class="block">
          <span class="font-medium text-gray-600">Label:</span>
          <input
            :value="node.attrs.label"
            type="text"
            class="w-full rounded border px-1 py-0.5 text-xs mt-0.5"
            @change="onLabelChange"
          />
        </label>

        <label class="block">
          <span class="font-medium text-gray-600">URL:</span>
          <input
            :value="node.attrs.href"
            type="text"
            class="w-full rounded border px-1 py-0.5 text-xs mt-0.5"
            placeholder="e.g. /products or https://example.com"
            @change="onHrefChange"
          />
        </label>

        <label class="block">
          <span class="font-medium text-gray-600">Target:</span>
          <select
            :value="node.attrs.target"
            class="w-full rounded border px-1 py-0.5 text-xs mt-0.5"
            @change="onTargetChange"
          >
            <option value="_self">Current window</option>
            <option value="_blank">New tab</option>
            <option value="_parent">Parent frame</option>
            <option value="_top">Top frame</option>
          </select>
        </label>

        <label class="block">
          <span class="font-medium text-gray-600">Rel:</span>
          <input
            :value="node.attrs.rel"
            type="text"
            class="w-full rounded border px-1 py-0.5 text-xs mt-0.5"
            placeholder="e.g. nofollow, noopener"
            @change="onRelChange"
          />
        </label>

        <div class="border-t pt-1 mt-1">
          <div class="text-xs font-semibold text-gray-600">Preview:</div>
          <a
            :href="node.attrs.href"
            :target="node.attrs.target"
            :rel="node.attrs.rel"
            class="text-blue-600 hover:underline text-xs"
          >
            {{ node.attrs.label }}
          </a>
        </div>
      </div>
    </span>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  updateAttributes: {
    type: Function,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
})

const onLabelChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  props.updateAttributes({ label: target.value })
}

const onHrefChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  props.updateAttributes({ href: target.value })
}

const onTargetChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  props.updateAttributes({ target: target.value })
}

const onRelChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  props.updateAttributes({ rel: target.value })
}
</script>

<style scoped>
.custom-link-node-view {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.custom-link-node-view:hover {
  outline: 1px solid #60a5fa;
  outline-offset: 1px;
  border-radius: 2px;
}
</style>
