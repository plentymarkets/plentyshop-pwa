<template>
  <NodeViewWrapper as="div" class="ui-button-node-view my-2">
    <div class="space-y-2 rounded border-2 border-blue-500 bg-blue-50 p-2">
      <div class="text-xs font-semibold text-blue-600">UI Button</div>

      <div class="space-y-1">
        <label class="block text-xs font-medium">
          Label:
          <input
            :value="node.attrs.label"
            type="text"
            class="w-full rounded border px-2 py-1 text-sm"
            @change="onLabelChange"
          />
        </label>

        <label class="block text-xs font-medium">
          Link To:
          <input
            :value="node.attrs.to"
            type="text"
            class="w-full rounded border px-2 py-1 text-sm"
            @change="onToChange"
          />
        </label>

        <label class="block text-xs font-medium">
          Variant:
          <select
            :value="node.attrs.variant"
            class="w-full rounded border px-2 py-1 text-sm"
            @change="onVariantChange"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="tertiary">Tertiary</option>
          </select>
        </label>
      </div>

      <div class="border-t pt-2">
        <div class="text-xs font-semibold text-gray-600">Preview:</div>
        <UiButton :variant="node.attrs.variant" class="mt-1">
          {{ node.attrs.label }}
        </UiButton>
      </div>
    </div>
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

const onToChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  props.updateAttributes({ to: target.value })
}

const onVariantChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  props.updateAttributes({ variant: target.value })
}
</script>

<style scoped>
.ui-button-node-view {
  /* Prevent text selection issues in editor */
  user-select: none;
}
</style>
