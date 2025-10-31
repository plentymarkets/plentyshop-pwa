export const useFormLabel = (labelText_: string, isOptional_: Ref<boolean> | boolean = false) => {
  const { t } = useI18n();

  const optional = ref(isOptional_);

  const labelText = computed(() => (optional.value ? labelText_ : `${labelText_} ${t('form.required')}`));

  const helperText = computed(() => (optional.value ? t('form.optional') : null));

  const getPlaceholder = (customSymbol: string = ''): ComputedRef<string> => {
    return computed(() => {
      if (optional.value) {
        return `${labelText_} (${t('form.optional')})`;
      }
      return `${labelText_} ${customSymbol}`;
    });
  };

  return {
    labelText,
    helperText,
    getPlaceholder,
  };
};
