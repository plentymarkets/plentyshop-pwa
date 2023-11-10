import type { SetCheckboxValue, SetShowErrors, UseAgreementCheckboxReturn, UseAgreementCheckboxState } from './types';

export const useAgreementCheckbox: UseAgreementCheckboxReturn = (source: string) => {
  const state = useState<UseAgreementCheckboxState>(`useAgreementCheckbox-${source}`, () => ({
    checkboxValue: false,
    showErrors: false,
    loading: false,
  }));

  const setShowErrors: SetShowErrors = (value: boolean) => {
    state.value.showErrors = value;
  };

  const setCheckboxValue: SetCheckboxValue = (value: boolean) => {
    state.value.checkboxValue = value;
    setShowErrors(!value);
  };

  return {
    setCheckboxValue,
    setShowErrors,
    ...toRefs(state.value),
  };
};
