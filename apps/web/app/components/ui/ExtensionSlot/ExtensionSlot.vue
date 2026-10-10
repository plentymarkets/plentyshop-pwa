<template>
  <!--
    Renders every component registered for this slot whose extension is currently enabled.
    When an extension is toggled off (flags.json → extension.<id>.enabled: false),
    useExtensionSlot's computed filters it out and Vue removes it from the DOM instantly.
    No page refresh needed.
  -->
  <component
    :is="getSlotComponent(entry.componentName)"
    v-for="entry in entries"
    :key="entry.componentName"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ name: string }>();

// entries is a computed ref: it re-evaluates whenever feature-flags state changes.
const { getSlotEntries, getSlotComponent } = useExtensionSlot();
const entries = getSlotEntries(props.name);
</script>
