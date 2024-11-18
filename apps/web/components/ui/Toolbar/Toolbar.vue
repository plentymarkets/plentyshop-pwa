<template>
  <div class="sticky top-0 bg-[#FDD835] py-2 z-50">
    <div class="flex justify-center md:justify-end pr-5 space-x-2">
      <UiButton
        variant="secondary"
        :size="buttonSize"
        class="self-start"
        @click="toggleEdit"
        :disabled="isEditingDisabled"
      >
        {{ isEditing ? 'Preview' : 'Edit' }}
      </UiButton>
      <UiButton
        variant="secondary"
        :size="buttonSize"
        class="self-start"
        :disabled="isEditingDisabled"
        @click="saveData"
      >
        <template v-if="loading">
          <SfLoaderCircular class="animate-spin w-4 h-4" />
        </template>

        <template v-else> Save </template>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';
const { isEditing, isEditingDisabled } = useEditor();

const viewport = useViewport();
const buttonSize = computed(() => {
  return viewport.isLessThan('md') ? 'sm' : 'lg';
});

const { saveData, loading } = useHomePageState();

console.log(isEditingDisabled.value);
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
</script>
