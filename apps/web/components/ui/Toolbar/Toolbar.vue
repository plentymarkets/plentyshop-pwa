<template>
  <div class="sticky top-0 bg-[#FDD835] py-2 z-50">
    <div class="flex justify-center md:justify-end pr-5 space-x-2">
      <UiButton variant="secondary" :size="buttonSize" class="self-start" @click="$emit('on-click')"> Edit </UiButton>
      <UiButton variant="secondary" :size="buttonSize" class="self-start" @click="$emit('on-click')"> Save </UiButton>
      <UiButton variant="secondary" :size="buttonSize" class="self-start" @click="$emit('on-click')">
        Publish
      </UiButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const viewport = useViewport();

const buttonSize = computed(() => {
  return viewport.isLessThan('md') ? 'sm' : 'lg';
});
</script>
