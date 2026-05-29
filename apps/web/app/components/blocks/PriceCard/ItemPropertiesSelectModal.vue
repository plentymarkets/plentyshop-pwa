<template>
  <div class="fixed inset-0 z-50 flex items-start justify-center bg-black/45 pt-12" @click.self="close">
    <div
      class="bg-white rounded-xl border border-neutral-200 w-full max-w-[420px] flex flex-col max-h-[90vh] shadow-md"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
        <h2 class="typography-headline-4 font-medium">{{ getEditorTranslation('modal-title') }}</h2>
        <div class="flex items-center gap-1">
          <SfTooltip :label="getEditorTranslation('info-tooltip')" class="max-w-[280px]" placement="bottom-end">
            <SfIconHelp class="cursor-pointer" size="sm" />
          </SfTooltip>
          <UiButton
            :aria-label="getEditorTranslation('close-modal-aria')"
            size="sm"
            square
            type="button"
            variant="tertiary"
            @click="close"
          >
            <SfIconClose size="sm" />
          </UiButton>
        </div>
      </div>

      <div class="px-5 py-3 border-b border-neutral-200">
        <SfInput v-model="searchQuery" :placeholder="getEditorTranslation('search-placeholder')" size="sm">
          <template #prefix>
            <SfIconSearch class="text-neutral-400" size="sm" />
          </template>
          <template v-if="searchQuery" #suffix>
            <button class="text-neutral-400 hover:text-neutral-600" type="button" @click="searchQuery = ''">
              <SfIconClose size="sm" />
            </button>
          </template>
        </SfInput>
      </div>

      <div class="overflow-y-auto flex-1">
        <div v-if="isLoading" class="px-5 py-8 text-center typography-text-sm text-neutral-400">
          {{ getEditorTranslation('loading-properties') }}
        </div>

        <div v-else-if="filteredGroups.length === 0" class="px-5 py-8 text-center typography-text-sm text-neutral-400">
          {{ getEditorTranslation('no-results', { query: searchQuery }) }}
        </div>

        <template v-for="(group, gi) in filteredGroups" :key="group.id">
          <hr v-if="gi > 0" class="border-neutral-100" />

          <div>
            <div
              class="flex items-center gap-2 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer select-none"
              @click="toggleGroup(group.id)"
            >
              <SfIconChevronRight
                :class="{ 'rotate-90': openGroups.includes(group.id) }"
                class="text-neutral-400 transition-transform duration-150 flex-shrink-0"
                size="sm"
              />
              <span class="typography-text-sm font-medium text-neutral-800 flex-1">
                {{ getGroupName(group) }}
              </span>
              <span class="typography-text-xs text-neutral-400 bg-neutral-200 rounded-full px-2 py-0.5">
                {{ group.properties.length }}
              </span>
            </div>

            <Transition name="slide">
              <div v-if="openGroups.includes(group.id)">
                <div class="px-4 py-2 border-b border-neutral-100 flex flex-col gap-1">
                  <label :class="{ 'is-checked': groupSelection[group.id]?.name }" class="checkbox-row">
                    <SfCheckbox
                      :model-value="groupSelection[group.id]?.name ?? false"
                      @update:model-value="(v) => toggleGroupItemSelection(group.id, 'name', !!v)"
                    />
                    <span class="field-tag">{{ getEditorTranslation('label-group') }}</span>
                    <span class="typography-text-xs font-medium text-neutral-700 select-none">
                      {{ getGroupName(group) }}
                    </span>
                  </label>
                </div>

                <div
                  v-for="prop in group.properties"
                  :key="prop.id"
                  class="px-4 py-2 border-b border-neutral-100 last:border-b-0 flex flex-col gap-1"
                >
                  <label :class="{ 'is-checked': selection[prop.id]?.name }" class="checkbox-row">
                    <SfCheckbox
                      :model-value="selection[prop.id]?.name ?? false"
                      @update:model-value="(v) => toggleSelection(prop.id, 'name', !!v)"
                    />
                    <span class="field-tag">{{ getEditorTranslation('label-name') }}</span>
                    <span class="typography-text-xs font-medium text-neutral-700 select-none">
                      {{ getPropName(prop) }}
                      <span class="text-neutral-400 font-normal">(ID: {{ prop.id }})</span>
                    </span>
                  </label>

                  <label :class="{ 'is-checked': selection[prop.id]?.value }" class="checkbox-row">
                    <SfCheckbox
                      :model-value="selection[prop.id]?.value ?? false"
                      @update:model-value="(v) => toggleSelection(prop.id, 'value', !!v)"
                    />
                    <span class="field-tag">{{ getEditorTranslation('label-value') }}</span>
                    <span class="variable-pill-static">
                      {{ getPropPlaceholder(prop) }}
                    </span>
                  </label>
                </div>
              </div>
            </Transition>
          </div>
        </template>
      </div>

      <div class="px-5 py-3 border-t border-neutral-200 flex items-center justify-between gap-3">
        <span class="typography-text-xs text-neutral-400">
          {{
            selectionCount === 0
              ? getEditorTranslation('no-items-selected')
              : getEditorTranslation('items-selected', { count: selectionCount })
          }}
        </span>
        <div class="flex gap-2">
          <UiButton size="sm" type="button" variant="secondary" @click="close">
            {{ getEditorTranslation('cancel') }}
          </UiButton>
          <UiButton :disabled="selectionCount === 0" size="sm" type="button" variant="primary" @click="insertSelected">
            {{ getEditorTranslation('insert') }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  SfInput,
  SfCheckbox,
  SfIconClose,
  SfIconSearch,
  SfIconChevronRight,
  SfTooltip,
  SfIconHelp,
} from '@storefront-ui/vue';
import type { ApiGroup } from './types';
import { useEditorItemProperties } from '~/composables/useEditorItemProperties';

const props = defineProps<{
  close: () => void;
  groups?: ApiGroup[];
}>();

const emit = defineEmits<{
  insert: [tokens: string[]];
}>();

const {
  loading: isLoading,
  searchQuery,
  openGroups,
  selection,
  groupSelection,
  filteredGroups,
  selectionCount,
  getGroupName,
  getPropName,
  getPropPlaceholder,
  toggleGroup,
  toggleSelection,
  toggleGroupItemSelection,
  insertSelected,
} = useEditorItemProperties({
  externalGroups: () => props.groups,
  onInsert: (tokens) => emit('insert', tokens),
  onClose: () => props.close(),
});
</script>

<i18n lang="json">
{
  "en": {
    "modal-title": "Properties",
    "close-modal-aria": "Close modal",
    "search-placeholder": "Search placeholders...",
    "loading-properties": "Loading properties...",
    "load-properties-error": "Could not load item properties. Showing fallback data.",
    "missing-translation": "Missing translation for id: {id}",
    "no-results": "No properties found for \"{query}\"",
    "no-items-selected": "No items selected",
    "items-selected": "{count} item(s) selected",
    "cancel": "Cancel",
    "insert": "Insert",
    "label-group": "Group",
    "label-name": "Name",
    "label-value": "Value",
    "info-tooltip": "Use placeholders to dynamically insert variation property names and values. For the placeholder to output data, the property needs to be assigned to the currently opened item and configured to be visible on item pages."
  },
  "de": {
    "modal-title": "Properties",
    "close-modal-aria": "Close modal",
    "search-placeholder": "Search placeholders...",
    "loading-properties": "Properties werden geladen...",
    "load-properties-error": "Eigenschaften konnten nicht geladen werden. Fallback-Daten werden angezeigt.",
    "missing-translation": "Missing translation for id: {id}",
    "no-results": "No properties found for \"{query}\"",
    "no-items-selected": "No items selected",
    "items-selected": "{count} item(s) selected",
    "cancel": "Cancel",
    "insert": "Insert",
    "label-group": "Group",
    "label-name": "Name",
    "label-value": "Value",
    "info-tooltip": "Use placeholders to dynamically insert variation property names and values. For the placeholder to output data, the property needs to be assigned to the currently opened item and configured to be visible on item pages."
  }
}
</i18n>

<style scoped>
.field-tag {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a3a3a3;
  min-width: 36px;
  flex-shrink: 0;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 0.12s,
    border-color 0.12s;
}
.checkbox-row:hover {
  background: #f5f3ff;
  border-color: #e9d5ff;
}
.checkbox-row.is-checked {
  background: #f5f3ff;
  border-color: #c4b5fd;
}

.variable-pill-static {
  display: inline-flex;
  align-items: center;
  font-size: 11.5px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #c5b4f0;
  background: #eeedfe;
  color: #3c3489;
  white-space: nowrap;
  pointer-events: none;
}
</style>
