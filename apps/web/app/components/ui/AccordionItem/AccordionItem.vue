<template>
  <SfAccordionItem v-model="internalModelValue" :summary-class="finalSummaryClass" data-testid="accordion-item">
    <template #summary>
      <SfIconChevronLeft
        v-if="iconPosition === 'start'"
        class="shrink-0 text-neutral-500"
        :class="internalModelValue ? 'rotate-90' : '-rotate-90'"
      />
      <slot name="summary">
        <p>{{ summary }}</p>
      </slot>
      <SfIconChevronLeft
        v-if="iconPosition !== 'start'"
        class="shrink-0 text-neutral-500"
        :class="internalModelValue ? 'rotate-90' : '-rotate-90'"
      />
    </template>
    <div :class="props.contentPaddingClass"><slot /></div>
  </SfAccordionItem>
</template>

<script setup lang="ts">
import { SfAccordionItem, SfIconChevronLeft } from '@storefront-ui/vue';
import { useVModel } from '@vueuse/core';
import type { AccordionItemProps } from '~/components/ui/AccordionItem/types';

const props = withDefaults(defineProps<AccordionItemProps>(), {
  contentPaddingClass: 'py-2 px-4',
  iconPosition: 'end',
});
const { summary = '', summaryClass = '', summaryActiveClass = '', iconPosition } = props;
const emit = defineEmits(['update:modelValue']);

const internalModelValue = useVModel(props, 'modelValue', emit, { passive: true });

const finalSummaryClass = computed(() => {
  if (internalModelValue.value) {
    return summaryClass && summaryActiveClass
      ? `${summaryClass} ${summaryActiveClass}`
      : summaryClass || summaryActiveClass;
  }

  return summaryClass;
});
</script>
