import type { Ref } from 'vue';

export interface ValidatorMethodObject {
  valid: boolean;
}

export type ValidatorInvalidFields = string;

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
  registerInvalidFields: (validMeta: boolean, orderProperty: string) => void;
}

export type UseValidatorAggregatorPropertiesReturn = () => UseValidatorAggregatorProperties;
