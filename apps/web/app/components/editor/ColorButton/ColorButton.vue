<template>
  <div ref="root" class="relative inline-block">
    <div class="rte__color cursor-pointer" :style="style" @mousedown.stop @click.stop="toggle" />

    <div v-if="open" class="absolute left-0 top-full z-50 mt-2" @mousedown.stop @click.stop>
      <div class="rounded-md border bg-white shadow-md p-3 min-w-[220px]">
        <fieldset class="mb-3">
          <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
            <div
              class="flex items-center justify-center w-1/2 px-3 py-1 cursor-pointer text-xs border-r"
              :class="{
                'bg-gray-100 text-gray-900 font-semibold': activeTab === 'shop',
              }"
              @click="activeTab = 'shop'"
            >
              Shop colors
            </div>
            <div
              class="flex items-center justify-center w-1/2 px-3 py-1 cursor-pointer text-xs"
              :class="{
                'bg-gray-100 text-gray-900 font-semibold': activeTab === 'picker',
              }"
              @click="activeTab = 'picker'"
            >
              Color Picker
            </div>
          </div>
        </fieldset>

        <div v-if="activeTab === 'picker'">
          <color-picker-block
            :model-value="modelValue"
            with-hex-input
            with-rgb-input
            @update:model-value="emit('update:modelValue', $event)"
          />
        </div>
        <div v-else>
          <div class="flex gap-2">
            <button
              type="button"
              class="h-8 w-8 rounded-md border border-slate-200"
              :style="{ backgroundColor: primaryColor }"
              @click="emit('update:modelValue', primaryColor)"
            />
            <button
              type="button"
              class="h-8 w-8 rounded-md border border-slate-200"
              :style="{ backgroundColor: secondaryColor }"
              @click="emit('update:modelValue', secondaryColor)"
            />
          </div>

          <div class="mt-3">
            <SfInput v-model="hexValue" type="text" size="sm" placeholder="#000000" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { SfInput } from '@storefront-ui/vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const activeTab = ref<'shop' | 'picker'>('picker');

const style = computed(() => ({
  backgroundColor: props.modelValue || '#000000',
}));

const hexValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value),
});

const { getSetting: getPrimaryColorSetting } = useSiteSettings('primaryColor');
const { getSetting: getSecondaryColorSetting } = useSiteSettings('secondaryColor');

const primaryColor = computed(() => getPrimaryColorSetting());
const secondaryColor = computed(() => getSecondaryColorSetting());

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function onDocClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) {
    close();
  }
}

document.addEventListener('mousedown', onDocClick);
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});
</script>

<style scoped>
.rte__color {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
}
</style>
