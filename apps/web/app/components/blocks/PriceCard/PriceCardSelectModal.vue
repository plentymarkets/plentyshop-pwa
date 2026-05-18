<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45" @click.self="close">
    <div class="bg-white rounded-xl border border-neutral-200 w-full max-w-[420px] flex flex-col max-h-[90vh] shadow-md">

      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
        <h2 class="typography-headline-4 font-medium">Variables</h2>
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
          placeholder="Search placeholders..."
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
          No variables found for "{{ searchQuery }}"
        </div>

        <template v-for="(group, gi) in filteredGroups" :key="group.id">
          <hr v-if="gi > 0" class="border-neutral-100" />

          <div>
            <!-- Group Header -->
            <button
              type="button"
              class="w-full flex items-center gap-2 px-5 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors select-none"
              @click="toggleGroup(group.id)"
            >
              <SfIconChevronRight
                size="sm"
                class="text-neutral-400 transition-transform duration-150"
                :class="{ 'rotate-90': openGroups.includes(group.id) }"
              />
              <span class="typography-text-sm font-medium text-neutral-800 flex-1 text-left">
                {{ group.name }}
              </span>
              <span class="typography-text-xs text-neutral-400 bg-neutral-200 rounded-full px-2 py-0.5">
                {{ group.properties.length }}
              </span>
            </button>

            <!-- Group Items -->
            <Transition name="slide">
              <div v-if="openGroups.includes(group.id)">
                <div
                  v-for="prop in group.properties"
                  :key="prop.value"
                  class="px-4 py-2 border-b border-neutral-100 last:border-b-0 flex flex-col gap-1"
                >
                  <!-- Name row -->
                  <label
                    class="checkbox-row"
                    :class="{ 'is-checked': selection[prop.value]?.name }"
                  >
                    <SfCheckbox
                      :model-value="selection[prop.value]?.name ?? false"
                      @update:model-value="(v) => toggleSelection(prop.value, 'name', v)"
                    />
                    <span class="typography-text-xs font-medium text-neutral-700 select-none">
                      {{ prop.name }}
                    </span>
                  </label>

                  <!-- Value row -->
                  <label
                    class="checkbox-row pl-5"
                    :class="{ 'is-checked': selection[prop.value]?.value }"
                  >
                    <SfCheckbox
                      :model-value="selection[prop.value]?.value ?? false"
                      @update:model-value="(v) => toggleSelection(prop.value, 'value', v)"
                    />
                    <span class="variable-pill-static">
                      {{ prop.value }}
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
          {{ selectionCount === 0 ? 'No items selected' : `${selectionCount} item${selectionCount > 1 ? 's' : ''} selected` }}
        </span>
        <div class="flex gap-2">
          <SfButton type="button" variant="secondary" size="sm" @click="close">
            Cancel
          </SfButton>
          <SfButton
            type="button"
            variant="primary"
            size="sm"
            :disabled="selectionCount === 0"
            @click="insertSelected"
          >
            Insert
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

interface Property {
  name: string;
  value: string;
}

interface Group {
  id: string;
  name: string;
  properties: Property[];
}

interface PropSelection {
  name: boolean;
  value: boolean;
}

const props = defineProps<{
  close: () => void;
}>();

const emit = defineEmits<{
  insert: [tokens: string[]];
}>();

const searchQuery = ref('');
const openGroups = ref<string[]>(['user-profile']);

// keyed by prop.value (unique); tracks name/value checkbox state
const selection = ref<Record<string, PropSelection>>({});

const groups: Group[] = [
  {
    id: 'user-profile',
    name: 'User Profile',
    properties: [
      { name: 'First Name',    value: '{{user.firstName}}' },
      { name: 'Last Name',     value: '{{user.lastName}}' },
      { name: 'Email Address', value: '{{user.email}}' },
      { name: 'Join Date',     value: '{{user.joinDate}}' },
      { name: 'Phone',         value: '{{user.phone}}' },
    ],
  },
  {
    id: 'invoice-details',
    name: 'Invoice Details',
    properties: [
      { name: 'Invoice No.',  value: '{{invoice.number}}' },
      { name: 'Due Date',     value: '{{invoice.dueDate}}' },
      { name: 'Total Amount', value: '{{invoice.totalAmount}}' },
      { name: 'Currency',     value: '{{invoice.currency}}' },
    ],
  },
  {
    id: 'system-variables',
    name: 'System Variables',
    properties: [
      { name: 'Current Date', value: '{{system.currentDate}}' },
      { name: 'Company Name', value: '{{system.companyName}}' },
      { name: 'Support URL',  value: '{{system.supportUrl}}' },
    ],
  },
];

// flat list to preserve insertion order across groups
const allProperties = groups.flatMap((g) => g.properties);

const filteredGroups = computed<Group[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return groups;
  return groups
    .map((group) => ({
      ...group,
      properties: group.properties.filter(
        (p) => p.name.toLowerCase().includes(q) || p.value.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.properties.length > 0);
});

const selectionCount = computed(() =>
  Object.values(selection.value).reduce(
    (acc, s) => acc + (s.name ? 1 : 0) + (s.value ? 1 : 0),
    0,
  ),
);

watch(searchQuery, (q) => {
  if (q) openGroups.value = filteredGroups.value.map((g) => g.id);
});

function toggleGroup(id: string) {
  const idx = openGroups.value.indexOf(id);
  if (idx === -1) openGroups.value.push(id);
  else openGroups.value.splice(idx, 1);
}

function toggleSelection(propValue: string, field: 'name' | 'value', checked: boolean) {
  if (!selection.value[propValue]) {
    selection.value[propValue] = { name: false, value: false };
  }
  selection.value[propValue][field] = checked;
}

function insertSelected() {
  const tokens: string[] = [];

  for (const prop of allProperties) {
    const s = selection.value[prop.value];
    if (!s) continue;
    if (s.name) tokens.push(prop.name);
    if (s.value) tokens.push(prop.value);
  }

  if (tokens.length === 0) return;

  navigator.clipboard?.writeText(tokens.join(' ')).catch(() => {});
  emit('insert', tokens);
  props.close();
}
</script>

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
  transition: max-height 0.2s ease, opacity 0.18s ease;
  max-height: 500px;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
