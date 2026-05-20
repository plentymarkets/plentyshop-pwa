<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45" @click.self="close">
    <div class="bg-white rounded-xl border border-neutral-200 w-full max-w-[420px] flex flex-col max-h-[90vh] shadow-md">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
        <h2 class="typography-headline-4 font-medium">{{ getEditorTranslation('modal-title') }}</h2>
        <SfButton
          type="button"
          variant="tertiary"
          size="sm"
          square
          :aria-label="getEditorTranslation('close-modal-aria')"
          @click="close"
        >
          <SfIconClose size="sm" />
        </SfButton>
      </div>

      <!-- Search -->
      <div class="px-5 py-3 border-b border-neutral-200">
        <SfInput
          v-model="searchQuery"
          :placeholder="getEditorTranslation('search-placeholder')"
          size="sm"
        >
          <template #prefix>
            <SfIconSearch size="sm" class="text-neutral-400" />
          </template>
          <template v-if="searchQuery" #suffix>
            <button
              type="button"
              class="text-neutral-400 hover:text-neutral-600"
              @click="searchQuery = ''"
            >
              <SfIconClose size="sm" />
            </button>
          </template>
        </SfInput>
      </div>

      <!-- Tree -->
      <div class="overflow-y-auto flex-1">
        <div v-if="filteredGroups.length === 0" class="px-5 py-8 text-center typography-text-sm text-neutral-400">
          {{ getEditorTranslation('no-results', { query: searchQuery }) }}
        </div>

        <template v-for="(group, gi) in filteredGroups" :key="group.id">
          <hr v-if="gi > 0" class="border-neutral-100" />

          <div>
            <!-- Group Header — with its own checkbox -->
            <div class="flex items-center gap-2 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <button
                type="button"
                class="flex items-center justify-center w-5 h-5 flex-shrink-0"
                @click="toggleGroup(group.id)"
              >
                <SfIconChevronRight
                  size="sm"
                  class="text-neutral-400 transition-transform duration-150"
                  :class="{ 'rotate-90': openGroups.includes(group.id) }"
                />
              </button>

              <label class="checkbox-row flex-1" :class="{ 'is-checked': groupCheckboxState(group).checked }">
                <SfCheckbox
                  :model-value="groupCheckboxState(group).checked"
                  :indeterminate="groupCheckboxState(group).indeterminate"
                  @update:model-value="(v) => toggleGroupSelection(group, !!v)"
                />
                <span class="typography-text-sm font-medium text-neutral-800 select-none">
                  {{ getGroupName(group) }}
                </span>
                <span class="typography-text-xs text-neutral-400 bg-neutral-200 rounded-full px-2 py-0.5 ml-auto">
                  {{ group.properties.length }}
                </span>
              </label>
            </div>

            <!-- Group Items -->
            <Transition name="slide">
              <div v-if="openGroups.includes(group.id)">
                <div
                  v-for="prop in group.properties"
                  :key="prop.id"
                  class="pl-10 pr-4 py-2 border-b border-neutral-100 last:border-b-0 flex flex-col gap-1"
                >
                  <!-- Property Name row -->
                  <label
                    class="checkbox-row"
                    :class="{ 'is-checked': selection[prop.id]?.name }"
                  >
                    <SfCheckbox
                      :model-value="selection[prop.id]?.name ?? false"
                      @update:model-value="(v) => toggleSelection(prop.id, 'name', !!v)"
                    />
                    <span class="typography-text-xs font-medium text-neutral-700 select-none">
                      {{ getPropName(prop) }}
                    </span>
                  </label>

                  <!-- Property Value (placeholder) row -->
                  <label
                    class="checkbox-row pl-5"
                    :class="{ 'is-checked': selection[prop.id]?.value }"
                  >
                    <SfCheckbox
                      :model-value="selection[prop.id]?.value ?? false"
                      @update:model-value="(v) => toggleSelection(prop.id, 'value', !!v)"
                    />
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

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-neutral-200 flex items-center justify-between gap-3">
        <span class="typography-text-xs text-neutral-400">
          {{
            selectionCount === 0
              ? getEditorTranslation('no-items-selected')
              : getEditorTranslation('items-selected', { count: selectionCount })
          }}
        </span>
        <div class="flex gap-2">
          <SfButton type="button" variant="secondary" size="sm" @click="close">
            {{ getEditorTranslation('cancel') }}
          </SfButton>
          <SfButton
            type="button"
            variant="primary"
            size="sm"
            :disabled="selectionCount === 0"
            @click="insertSelected"
          >
            {{ getEditorTranslation('insert') }}
          </SfButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SfButton,
  SfInput,
  SfCheckbox,
  SfIconClose,
  SfIconSearch,
  SfIconChevronRight,
} from '@storefront-ui/vue';
import type { ApiGroup, ApiProperty, PropSelection } from './types';
import { mockGroups } from './PriceCardSelectModal.mock';

// ── Component ─────────────────────────────────────────────────────────────────

const props = defineProps<{
  close: () => void;
  /** Pass the API response directly; falls back to mock data if omitted */
  groups?: ApiGroup[];
}>();

const emit = defineEmits<{
  insert: [tokens: string[]];
}>();

// ── State ─────────────────────────────────────────────────────────────────────

const { locale } = useI18n();
const lang = computed(() => (locale.value === 'de' ? 'de' : 'en') as 'de' | 'en');

const sourceGroups = computed<ApiGroup[]>(() => props.groups ?? mockGroups);

const searchQuery = ref('');
// open first group by default
const openGroups = ref<number[]>(sourceGroups.value[0]?.id !== undefined ? [sourceGroups.value[0].id] : []);

watch(
  () => sourceGroups.value[0]?.id,
  (firstId) => {
    if (firstId !== undefined && openGroups.value.length === 0) {
      openGroups.value = [firstId];
    }
  },
);

// keyed by property id
const selection = ref<Record<number, PropSelection>>({});

// ── Helpers ───────────────────────────────────────────────────────────────────

const getGroupName = (group: ApiGroup): string => {
  return group.names[lang.value] ?? group.names.de ?? `Group ${group.id}`;
};

const getPropName = (prop: ApiProperty): string => {
  return prop.names[lang.value] ?? prop.names.de ?? `Property ${prop.id}`;
};

const getPropPlaceholder = (prop: ApiProperty): string => {
  return `{{property.${prop.id}}}`;
};

// ── Filtering ─────────────────────────────────────────────────────────────────

const filteredGroups = computed<ApiGroup[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return sourceGroups.value;
  return sourceGroups.value
    .map((group) => ({
      ...group,
      properties: group.properties.filter((p) =>
        getPropName(p).toLowerCase().includes(q) ||
        getPropPlaceholder(p).toLowerCase().includes(q),
      ),
    }))
    .filter((group) =>
      group.properties.length > 0 || getGroupName(group).toLowerCase().includes(q),
    );
});

watch(searchQuery, (q) => {
  if (q) openGroups.value = filteredGroups.value.map((g) => g.id);
});

// ── Group toggle (collapse) ───────────────────────────────────────────────────

const toggleGroup = (id: number) => {
  const idx = openGroups.value.indexOf(id);
  if (idx === -1) openGroups.value.push(id);
  else openGroups.value.splice(idx, 1);
};

// ── Checkbox logic ────────────────────────────────────────────────────────────

const toggleSelection = (propId: number, field: 'name' | 'value', checked: boolean) => {
  if (!selection.value[propId]) {
    selection.value[propId] = { name: false, value: false };
  }
  selection.value[propId][field] = checked;
};

/** Returns checked/indeterminate state for a group's header checkbox */
const groupCheckboxState = (group: ApiGroup): { checked: boolean; indeterminate: boolean } => {
  const total = (group.properties?.length ?? 0) * 2; // name + value per prop
  let selected = 0;
  for (const prop of group.properties) {
    const s = selection.value[prop.id];
    if (s?.name) selected++;
    if (s?.value) selected++;
  }
  if (selected === 0) return { checked: false, indeterminate: false };
  if (selected === total) return { checked: true, indeterminate: false };
  return { checked: false, indeterminate: true };
};

/** Select / deselect all name+value checkboxes in a group */
const toggleGroupSelection = (group: ApiGroup, checked: boolean) => {
  for (const prop of group.properties) {
    selection.value[prop.id] = { name: checked, value: checked };
  }
  // open the group when selecting so user can see what was picked
  if (checked && !openGroups.value.includes(group.id)) {
    openGroups.value.push(group.id);
  }
};

// ── Selection count ───────────────────────────────────────────────────────────

const selectionCount = computed(() =>
  Object.values(selection.value).reduce(
    (acc, s) => acc + (s.name ? 1 : 0) + (s.value ? 1 : 0),
    0,
  ),
);

// ── Insert ────────────────────────────────────────────────────────────────────


const insertSelected = () => {
  const tokens: string[] = [];

  for (const group of sourceGroups.value) {
    for (const prop of group.properties) {
      const s = selection.value[prop.id];
      if (!s) continue;
      if (s.name) tokens.push(getPropName(prop));
      if (s.value) tokens.push(getPropPlaceholder(prop));
    }
  }

  if (tokens.length === 0) return;

  navigator.clipboard?.writeText(tokens.join(' '));
  emit('insert', tokens);
  props.close();
};
</script>

<i18n lang="json">
{
  "en": {
    "modal-title": "Properties",
    "close-modal-aria": "Close modal",
    "search-placeholder": "Search placeholders...",
    "no-results": "No properties found for \"{query}\"",
    "no-items-selected": "No items selected",
    "items-selected": "{count} item(s) selected",
    "cancel": "Cancel",
    "insert": "Insert"
  },
  "de": {
    "modal-title": "Properties",
    "close-modal-aria": "Close modal",
    "search-placeholder": "Search placeholders...",
    "no-results": "No properties found for \"{query}\"",
    "no-items-selected": "No items selected",
    "items-selected": "{count} item(s) selected",
    "cancel": "Cancel",
    "insert": "Insert"
  }
}
</i18n>

<style scoped>
.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
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

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 600px;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
