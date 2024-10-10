<template>
  <h2>{{ title }}</h2>
</template>

<script lang="ts" setup>
defineBlokkli({
  bundle: 'title',
});

defineProps<{
  title: string;
}>();
</script>
