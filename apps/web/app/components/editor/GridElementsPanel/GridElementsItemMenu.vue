<template>
  <div class="no-drag relative flex-shrink-0">
    <button
      :data-testid="`actions-menu-item-${index}`"
      class="p-0.5 rounded cursor-pointer text-editor-icon hover:text-editor-accent transition-colors"
      :class="{
        '!text-editor-icon': isOpen,
        'text-editor-icon/40': !blockVisible,
      }"
      :aria-label="getEditorTranslation('actions-aria')"
      @click.stop="emit('toggle')"
    >
      <SfIconMoreVert size="xs" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-editor-border z-dropdown"
      @click.stop
    >
      <div class="px-3 py-2.5 border-b border-editor-border flex items-center justify-between gap-2">
        <span class="text-xs text-editor-text-subtle">{{ getEditorTranslation('visibility') }}</span>
        <SfSwitch
          :model-value="blockVisible"
          :data-testid="`actions-toggle-visibility-item-${index}`"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          @update:model-value="emit('toggle-visibility')"
        />
      </div>
      <EditorColumnStickyMenuRow
        v-if="parentUuid !== undefined && columnIndex !== undefined"
        :parent-uuid="parentUuid"
        :column-index="columnIndex"
        :index="index"
      />
      <button
        :data-testid="`actions-delete-item-${index}`"
        class="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="minItemsReached"
        @click="emit('delete')"
      >
        <SfIconDelete size="xs" />
        {{ getEditorTranslation('delete') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch, SfIconMoreVert, SfIconDelete } from '@storefront-ui/vue';

defineProps<{
  index: number;
  isOpen: boolean;
  blockVisible: boolean;
  minItemsReached: boolean;
  parentUuid?: string;
  columnIndex?: number;
}>();

const emit = defineEmits<{
  toggle: [];
  'toggle-visibility': [];
  delete: [];
}>();
</script>

<i18n lang="json">
{
  "en": {
    "visibility": "Visibility",
    "delete": "Delete",
    "actions-aria": "Block actions"
  },
  "de": {
    "visibility": "Visibility",
    "delete": "Delete",
    "actions-aria": "Block actions"
  }
}
</i18n>
