<template>
  <UiButton
    type="submit"
    data-testid="place-order-button"
    @click="emits('click')"
    :disabled="disabled"
    size="lg"
    class="w-full mb-4 md:mb-0 cursor-pointer"
  >
    {{ $t('buy') }}
  </UiButton>
</template>
<script lang="ts" setup>
const emits = defineEmits(['click']);
const { disabled = false } = defineProps<{ disabled: boolean }>();
</script>
