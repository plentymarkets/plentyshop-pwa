<template>
  <NuxtLink v-if="isInternalLink" :to="href" :target="target" :rel="rel">
    <slot />
  </NuxtLink>
  <a v-else :href="href" :target="target" :rel="rel">
    <slot />
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: '/',
  },
  target: {
    type: String,
    default: '_self',
  },
  rel: {
    type: String,
    default: '',
  },
})

const isInternalLink = computed(() => {
  return props.href?.startsWith('/') || props.href?.startsWith('#')
})
</script>
