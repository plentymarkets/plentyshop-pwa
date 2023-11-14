export interface UseAgreementCheckboxState {
  checkboxValue: boolean;
  showErrors: boolean;
}

export type SetCheckboxValue = (value: boolean) => void;
export type SetShowErrors = (value: boolean) => void;

export interface UseAgreementCheckboxMethods {
  checkboxValue: Readonly<Ref<UseAgreementCheckboxState['checkboxValue']>>;
  showErrors: Readonly<Ref<UseAgreementCheckboxState['showErrors']>>;
  setCheckboxValue: SetCheckboxValue;
  setShowErrors: SetShowErrors;
}

export type UseAgreementCheckboxReturn = (source: string) => UseAgreementCheckboxMethods;
