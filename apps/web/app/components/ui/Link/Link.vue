<template>
  <component
    :is="tag"
    :class="[
      'focus-visible:outline focus-visible:outline-offset focus-visible:rounded-xs underline hover:no-underline',
      variantClasses[variant],
      $attrs.class,
    ]"
    :type="type"
    data-testid="link"
    v-bind="attrsWithoutClass"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { PropType, ConcreteComponent } from 'vue';
import { SfLinkVariant } from '@storefront-ui/vue';

const props = defineProps({
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: 'a',
  },
  variant: {
    type: String as PropType<`${SfLinkVariant}`>,
    default: SfLinkVariant.primary,
  },
});
defineOptions({
  inheritAttrs: false,
});

const variantClasses = {
  [SfLinkVariant.primary]: 'text-primary-700 hover:text-primary-800 active:text-primary-700',
  [SfLinkVariant.secondary]: 'text-neutral-700 hover:text-neutral-800 active:text-neutral-700',
};

const attrs = useAttrs();
const attrsWithoutClass = computed(() => {
  const { class: _, ...rest } = attrs;
  return rest;
});

const type = computed(() => {
  if (attrs.type) return undefined;
  return typeof props.tag === 'string' && props.tag.toLowerCase() === 'button' ? 'button' : undefined;
});
</script>
