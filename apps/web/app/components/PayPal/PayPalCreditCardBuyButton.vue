<template>
  <UiButton
    type="submit"
    data-testid="place-order-button"
    :disabled="props.disabled"
    size="lg"
    class="w-full mb-4 md:mb-0 cursor-pointer"
    @click="emits('click')"
  >
    {{ t('buy') }}
  </UiButton>
</template>
<script lang="ts" setup>
const emits = defineEmits(['click']);
const { t } = useI18n();

const props = withDefaults(defineProps<{ disabled?: boolean }>(), {
  disabled: false,
});
</script>
