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
  (e: 'update:modelValue', v: string): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const activeTab = ref<'shop' | 'picker'>('picker');

const dropdownPositionClass = computed(() => {
  switch (props.dropdownAlign) {
    case 'rte':
      return 'right-0 translate-x-1/2';
    case 'ctr':
      return '';
    case 'default':
    default:
      return '-translate-x-[5%]';
  }
});

const style = computed(() => ({
  backgroundColor: props.modelValue || '#000000',
}));

const previewColor = computed(() => style.value.backgroundColor as string);

const { getSetting: getPrimaryColorSetting } = useSiteSettings('primaryColor');
const { getSetting: getSecondaryColorSetting } = useSiteSettings('secondaryColor');

const primaryColor = computed(() => getPrimaryColorSetting());
const secondaryColor = computed(() => getSecondaryColorSetting());

const openDropdown = () => {
  open.value = true;
};

const close = () => {
  open.value = false;
};

const toggle = () => {
  open.value = !open.value;
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
