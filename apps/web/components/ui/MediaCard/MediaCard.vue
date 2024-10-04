<template>
  <div
    v-if="showComponent"
    :class="image ? 'flex flex-col md:flex-row items-center md:items-start' : 'flex justify-center items-center'"
  >
    <div v-if="image" :class="text ? 'w-full md:w-1/2 mb-4 md:mb-0' : 'w-full'">
      <img :src="image" alt="Media Image" class="w-full h-auto object-cover" />
    </div>

    <div v-if="text" :class="image ? 'w-full md:w-1/2 md:pl-8' : 'w-full text-center'" v-html="text"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  image: {
    type: String,
    default: null,
  },
  text: {
    type: String,
    default: null,
  },
});
const showComponent = computed(() => props.image || props.text);
</script>
