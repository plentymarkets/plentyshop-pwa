<template>
  <div class="flex w-full items-center py-2">
    <div class="mr-auto text-lg">{{ lang }}</div>
    <div>
      <SfSwitch v-model="data" class="peer" @update:model-value="update" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
import type { ActiveLanguageSwitchProps } from './types';

const emit = defineEmits<{
  (e: 'update:selected', value: boolean): void;
}>();
const props = defineProps<ActiveLanguageSwitchProps>();
const isSelected = computed(() => props.selected);
const data = ref(props.selected);

const update = () => {
  emit('update:selected', data.value);
};

watch(props, () => {
  data.value = isSelected.value;
});
</script>
