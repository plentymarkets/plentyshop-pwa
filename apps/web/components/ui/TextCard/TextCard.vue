<template>
  <div :class="['w-full', 'flex', 'flex-col', 'items-start', 'p-5', 'space-y-4', textAlignmentClass]">
    <div v-if="pretitle" class="text-xl font-bold mb-2">{{ pretitle }}</div>
    <div v-if="title" class="text-2xl font-semibold mb-4">{{ title }}</div>
    <div v-if="subtitle" class="text-lg font-semibold">{{ subtitle }}</div>
    <div v-if="description" class="text-base" v-html="description"></div>
    <UiButton v-if="buttonText && link" class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
      {{ buttonText }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  pretitle: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  buttonText: {
    type: String,
    default: null,
  },
  alignment: {
    type: String,
    default: 'left',
    validator: (value: string) => ['left', 'center', 'right'].includes(value),
  },
  link: {
    type: String,
    default: null,
  },
});

const textAlignmentClass = computed(() => {
  switch (props.alignment) {
    case 'center': {
      return 'text-center items-center md:text-center';
    }
    case 'right': {
      return 'text-right items-end md:text-right';
    }
    default: {
      return 'text-left items-start md:text-left';
    }
  }
});
</script>
