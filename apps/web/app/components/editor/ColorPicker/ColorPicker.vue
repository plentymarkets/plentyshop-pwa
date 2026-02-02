<template>
  <div ref="root" class="relative inline-block">
    <slot
      name="trigger"
      :value="modelValue"
      :color="previewColor"
      :is-open="open"
      :toggle="toggle"
      :open="openDropdown"
      :close="close"
    >
      <div class="h-8 w-8 border border-[#dee2e6] cursor-pointer" :style="style" @mousedown.stop @click.stop="toggle" />
    </slot>

    <div v-if="open" :class="['absolute top-full z-50 mt-2', dropdownPositionClass]" @mousedown.stop @click.stop>
      <EditorColorPickerPanel
        :model-value="modelValue"
        :active-tab="activeTab"
        :primary-color="primaryColor"
        :secondary-color="secondaryColor"
        @update:model-value="emit('update:modelValue', $event)"
        @update:active-tab="activeTab = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | undefined;
  dropdownAlign?: 'default' | 'rte' | 'ctr';
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const activeTab = ref<'shop' | 'picker'>('picker');

const instanceId = `color-picker-${Math.random().toString(36).slice(2)}`;
const activeId = useState<string | null>('editorColorPickerActiveId', () => null);

const dropdownPositionClass = computed(() => {
  if (props.dropdownAlign === 'rte') {
    return 'right-0 translate-x-1/2';
  }
  return '';
});
const style = computed(() => ({
  backgroundColor: props.modelValue || '#ffffff',
}));

const previewColor = computed(() => style.value.backgroundColor as string);

const { getSetting: getPrimaryColorSetting } = useSiteSettings('primaryColor');
const { getSetting: getSecondaryColorSetting } = useSiteSettings('secondaryColor');

const primaryColor = computed(() => getPrimaryColorSetting());
const secondaryColor = computed(() => getSecondaryColorSetting());

watch(
  activeId,
  (newId) => {
    open.value = newId === instanceId;
  },
  { immediate: true },
);

const openDropdown = () => {
  activeId.value = instanceId;
};

const close = () => {
  if (activeId.value === instanceId) {
    activeId.value = null;
  }
};

const toggle = () => {
  if (open.value) {
    close();
  } else {
    openDropdown();
  }
};

const onDocClick = (e: MouseEvent) => {
  if (!root.value?.contains(e.target as Node)) {
    close();
  }
};

document.addEventListener('mousedown', onDocClick);
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});
</script>
