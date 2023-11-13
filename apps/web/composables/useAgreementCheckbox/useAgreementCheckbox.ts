import type { SetCheckboxValue, SetShowErrors, UseAgreementCheckboxReturn, UseAgreementCheckboxState } from './types';

/**
 * @description Composable for getting the general terms checkbox.
 * @param source string
 * @example
 * ``` ts
 * const {
 * checkboxValue, showErrors, loading, setCheckboxValue, showErrors
 * } = useAgreementCheckbox('checkoutGeneralTerms');
 * ```
 */
export const useAgreementCheckbox: UseAgreementCheckboxReturn = (source: string) => {
  const state = useState<UseAgreementCheckboxState>(`useAgreementCheckbox-${source}`, () => ({
    checkboxValue: false,
    showErrors: false,
    loading: false,
  }));

  /**
   * @description Set if the errors should be displayed.
   * @param value boolean
   * @returns SetShowErrors
   * @example
   * ``` ts
   * setShowErrors(true);
   * ```
   */
  const setShowErrors: SetShowErrors = (value: boolean) => {
    state.value.showErrors = value;
  };

  /**
   * @description Set checkbox value.
   * @param value boolean
   * @returns SetCheckboxValue
   * @example
   * ``` ts
   * setCheckboxValue(true);
   * ```
   */
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
