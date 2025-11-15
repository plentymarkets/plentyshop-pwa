<script setup lang="ts">
const { myLayer } = useAppConfig()
</script>

<template>
  <div>
    <h1>Hello World From inside layer!</h1>
    <pre>{{ myLayer }}</pre>
  </div>
</template>
