import type { SetCheckboxValue, SetShowErrors, UseAgreementCheckboxReturn, UseAgreementCheckboxState } from './types';

/**
 * @description Composable for managing agreement checkboxes.
 * @param source string
 * @returns UseAgreementCheckboxReturn
 * @example
 * ``` ts
 * const {
 * checkboxValue, showErrors, setCheckboxValue, setShowErrors
 * } = useAgreementCheckbox('checkoutGeneralTerms');
 * ```
 */
export const useAgreementCheckbox: UseAgreementCheckboxReturn = (source: string) => {
  const state = useState<UseAgreementCheckboxState>(`useAgreementCheckbox-${source}`, () => ({
    checkboxValue: false,
    showErrors: false,
  }));

  /**
   * @description Set checkbox errors visibility.
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
