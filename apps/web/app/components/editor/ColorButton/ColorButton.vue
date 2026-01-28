<template>
  <div ref="root" class="relative inline-block">
    <div class="rte__color cursor-pointer" :style="style" @mousedown.stop @click.stop="toggle" />

    <div v-if="open" class="absolute left-0 top-full z-50 mt-2" @mousedown.stop @click.stop>
      <ColorButtonPanel
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
import ColorButtonPanel from './ColorButtonPanel.vue';
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

const { getSetting: getPrimaryColorSetting } = useSiteSettings('primaryColor');
const { getSetting: getSecondaryColorSetting } = useSiteSettings('secondaryColor');

const primaryColor = computed(() => getPrimaryColorSetting());
const secondaryColor = computed(() => getSecondaryColorSetting());

const toggle = () => {
  open.value = !open.value;
};

const close = () => {
  open.value = false;
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

<style scoped>
.rte__color {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
}
</style>
