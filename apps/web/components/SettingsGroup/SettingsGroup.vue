<template>
  <UiAccordionItem
    v-model="colorsOpen"
    data-testid="color-section"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 class="">
        <slot name="settings-group-title" />
      </h2>
    </template>
    <slot />
  </UiAccordionItem>
</template>

<script setup lang="ts">
const colorsOpen = ref(false);

const fonts = ref([]);

onMounted(async () => {
  const response = await fetch('/_nuxt-plenty/editor/fonts.json');

  if (response.ok) {
    fonts.value = await response.json();
  }
});
</script>
