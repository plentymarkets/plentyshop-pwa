<template>
  <component
    :is="tagWithDefaults"
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center font-medium text-base focus-visible:outline focus-visible:outline-offset rounded-md disabled:text-disabled-500 disabled:bg-disabled-300 disabled:shadow-none disabled:ring-0 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses[variant],
    ]"
    data-testid="button"
  >
    <slot v-if="$slots.prefix" name="prefix" />
    <slot />
    <slot v-if="$slots.suffix" name="suffix" />
  </component>
</template>

<script lang="ts" setup>
import type { ConcreteComponent } from 'vue';
import { useAttrsRef, SfButtonSize } from '@storefront-ui/vue';
import { SfButtonCustomVariant } from './types';

const props = defineProps({
  size: {
    type: String as PropType<`${SfButtonSize}`>,
    default: SfButtonSize.base,
  },
  variant: {
    type: String as PropType<`${SfButtonCustomVariant}`>,
    default: SfButtonCustomVariant.primary,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String, Object] as PropType<string | ConcreteComponent>,
    default: undefined,
  },
});

const { size, tag, square } = toRefs(props);

const sizeClasses = computed(() => {
  switch (size.value) {
    case SfButtonSize.sm: {
      return [square.value ? 'p-1.5' : 'leading-5 text-sm py-1.5 px-3', 'gap-1.5'];
    }
    case SfButtonSize.lg: {
      return [square.value ? 'p-4' : 'py-3 leading-6 px-6', 'gap-3'];
    }
    default: {
      return [square.value ? 'p-2' : 'py-2 leading-6 px-4', 'gap-2'];
    }
  }
});
const tagWithDefaults = computed(() => tag?.value || 'button');

const attrs = useAttrsRef();
const type = computed(
  () =>
    attrs.value.type ??
    (typeof tagWithDefaults.value === 'string' && tagWithDefaults.value.toLowerCase() === 'button'
      ? 'button'
      : undefined),
);
</script>
<script lang="ts">
export const variantClasses = {
  [SfButtonCustomVariant.customPrimary]:
    'text-white shadow hover:shadow-md active:shadow bg-custom-primary-500 hover:bg-custom-primary-600 active:bg-custom-primary-700 disabled:bg-custom-disabled-300',
  [SfButtonCustomVariant.customTertiary]:
    'text-custom-primary-500 hover:bg-custom-primary-100 hover:text-custom-primary-800 active:bg-custom-primary-200 active:text-custom-primary-900 disabled:bg-transparent',
  [SfButtonCustomVariant.primary]:
    'text-white shadow hover:shadow-md active:shadow bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:bg-disabled-300',
  [SfButtonCustomVariant.secondary]:
    'text-primary-500 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 ring-1 ring-inset ring-primary-500 shadow hover:shadow-md active:shadow hover:ring-primary-800 active:ring-primary-900 disabled:ring-1 disabled:ring-disabled-300 disabled:bg-white/50',
  [SfButtonCustomVariant.tertiary]:
    'text-primary-500 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 disabled:bg-transparent',
};
</script>
