import type { Ref } from 'vue';

export interface ValidatorMethodObject {
  valid: boolean;
}

export interface ValidatorInvalidFields {
  [key: string]: boolean;
}

export type ValidatorMethodType = () => Promise<ValidatorMethodObject>;

export interface UseValidatorAggregatorPropertiesState {
  invalidFields: ValidatorInvalidFields[];
  validators: ValidatorMethodType[];
}

export interface UseValidatorAggregatorProperties {
  validateAllFields: () => Promise<ValidatorMethodObject[]>;
  registerValidator: (validator: ValidatorMethodType) => void;
  invalidFields: Ref<UseValidatorAggregatorPropertiesState['invalidFields']>;
  validators: Ref<UseValidatorAggregatorPropertiesState['validators']>;
}

export type UseValidatorAggregatorPropertiesReturn = () => UseValidatorAggregatorProperties;
