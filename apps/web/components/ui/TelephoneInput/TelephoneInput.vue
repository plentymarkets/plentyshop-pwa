<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1">
      {{ label }}
    </label>

    <vue-tel-input
      v-model="localValue"
      :only-countries="onlyCountries"
      :default-country="defaultCountry"
      :auto-default-country="false"
      :input-options="inputOptions"
      :valid-characters-only="true"
      :style-classes="styleClasses"
      :preferred-countries="preferredCountries"
      :dropdown-options="dropdownOptions"
      :mode="mode"
      @validate="(validation: PhoneValidationResult) => emit('validPhoneNumber', validation)"
    />

    <div class="h-[2rem] mt-1">
      <div v-if="error" class="text-sm text-negative-700">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import type { PhoneValidationResult } from '~/components/ui/TelephoneInput/types';
import type { TelephoneInputProps } from './types';

const props = withDefaults(defineProps<TelephoneInputProps>(), {
  id: () => `tel-input-${Math.random().toString(36).substring(2, 7)}`,
  label: '',
  placeholder: 'Enter phone number',
  preferredCountries: () => [],
  onlyCountries: () => [],
  defaultCountry: '',
  mode: 'international',
  error: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'validPhoneNumber', validation: PhoneValidationResult): void;
}>();

const { t } = useI18n();
const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => (localValue.value = val),
);

watch(localValue, (val) => {
  emit('update:modelValue', val);
});

const dropdownOptions = {
  showDialCodeInList: false,
  showDialCodeInSelection: false,
  showFlags: true,
  showSearchBox: true,
  searchBoxPlaceholder: t('checkoutPayment.countrySearch'),
};

const inputOptions = {
  id: props.id,
  autocomplete: 'on',
  maxlength: 25,
  showDialCode: true,
  type: 'tel',
  placeholder: props.placeholder,
  styleClasses: 'w-full px-3 py-2 text-sm placeholder-gray-400 rounded focus:outline-none focus:ring-0',
};

const styleClasses = computed(() =>
  [
    'flex items-center gap-2 px-4 bg-white rounded h-[40px] hover:ring-primary-700 focus-within:caret-primary-700 active:caret-primary-700 active:ring-primary-700 active:ring-2 focus-within:ring-primary-700 focus-within:ring-2',
    props.error ? 'ring-2 ring-negative-700' : 'ring-1 ring-neutral-300',
  ].join(' '),
);
</script>

<style>
.vue-tel-input {
  @apply w-full relative p-0 border-none bg-transparent shadow-none focus-within:shadow-none;
}

.vue-tel-input input {
  @apply bg-transparent focus:outline-none text-sm;
}

.vti__dropdown {
  @apply rounded ml-1 select-none;
}

.vti__dropdown-list {
  @apply absolute z-50 mt-[8px] min-w-full max-h-60 left-[-5px] overflow-y-auto overflow-x-hidden rounded border border-gray-200;
}

.vti__dropdown-item {
  @apply flex items-center justify-between px-3 py-2 text-sm text-gray-800 cursor-pointer transition-colors hover:bg-gray-100 select-none;
}

.vti__dropdown-item.highlighted {
  @apply bg-blue-50 text-blue-700;
}

.vti__dropdown-item.preferred {
  @apply font-semibold;
}

.vti__flag {
  @apply inline-block w-5 h-4 rounded-sm overflow-hidden mr-2;
}

.vti__search_box {
  @apply rounded w-[99%];
}
</style>
