<template>
  <div class="sticky top-0 bg-[#FDD835] py-2 z-50">
    <div class="flex justify-center md:justify-end pr-5 space-x-2">
      <UiButton variant="secondary" :size="buttonSize" class="self-start" @click="toggleEdit">
        {{ isEditing ? 'Preview' : 'Edit' }}
      </UiButton>
      <UiButton variant="secondary" :size="buttonSize" class="self-start"> Save </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const isEditing = useEditor();

const viewport = useViewport();
const buttonSize = computed(() => {
  return viewport.isLessThan('md') ? 'sm' : 'lg';
});

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
</script>
