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

    <div v-if="open" ref="floatingEl" :style="floatingStyles" class="z-picker">
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
  </div>
</template>

<script setup lang="ts">
import { useDropdown } from '@storefront-ui/vue';

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined;
    align?: 'left' | 'center' | 'right';
    showShopColors?: boolean;
  }>(),
  {
    align: 'left',
    showShopColors: true,
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const floatingEl = ref<HTMLElement | null>(null);
const activeTab = ref<'shop' | 'picker'>('picker');

const placementMap = {
  left: 'bottom-end',
  center: 'bottom',
  right: 'bottom-start',
} as const;

const instanceId = `color-picker-${Math.random().toString(36).slice(2)}`;
const activeId = useState<string | null>('editorColorPickerActiveId', () => null);

const close = () => {
  if (activeId.value === instanceId) {
    activeId.value = null;
  }
};

const { style: floatingStyles } = useDropdown({
  referenceRef: root,
  floatingRef: floatingEl,
  isOpen: open,
  placement: computed(() => placementMap[props.align]),
  strategy: 'fixed',
  onClose: close,
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

const toggle = () => {
  if (open.value) {
    close();
  } else {
    openDropdown();
  }
};
</script>
