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

    <Teleport to="body">
      <div v-if="open" :style="floatingStyle" class="fixed z-[9999]" @mousedown.stop @click.stop>
        <EditorColorPickerPanel
        :model-value="modelValue"
        :active-tab="activeTab"
        :primary-color="primaryColor"
        :secondary-color="secondaryColor"
        :show-shop-colors="props.showShopColors"
        @update:model-value="emit('update:modelValue', $event)"
        @update:active-tab="activeTab = $event"
      />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | undefined;
    dropdownAlign?: 'default' | 'rte' | 'top-editor';
    showShopColors?: boolean;
  }>(),
  {
    dropdownAlign: 'default',
    showShopColors: true,
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const open = ref(false);
const activeTab = ref<'shop' | 'picker'>('picker');

const { triggerRef: root, floatingStyle, updatePosition } = useFloatingDropdown({ handleClickOutside: false });

const instanceId = `color-picker-${Math.random().toString(36).slice(2)}`;
const activeId = useState<string | null>('editorColorPickerActiveId', () => null);

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
  updatePosition(props.dropdownAlign !== 'default' ? 'right' : 'left');
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

onMounted(() => {
  document.addEventListener('mousedown', onDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});
</script>
