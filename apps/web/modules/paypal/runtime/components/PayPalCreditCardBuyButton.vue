<template>
  <UiButton
    type="submit"
    data-testid="place-order-button"
    :disabled="props.disabled"
    size="lg"
    class="w-full mb-4 md:mb-0 cursor-pointer"
    @click="emits('click', $event)"
  >
    <slot>{{ t('common.actions.buy') }}</slot>
  </UiButton>
</template>
<script lang="ts" setup>
const emits = defineEmits<{ click: [event: MouseEvent] }>();

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});
</script>
