export interface ValidatorMethodObject {
  valid: boolean;
}

export type ValidatorInvalidFields = {
  key: string;
  name: string;
};

export type ValidatorMethodType = () => Promise<ValidatorMethodObject>;

export interface UseValidatorAggregatorState {
  invalidFields: ValidatorInvalidFields[];
  validators: ValidatorMethodType[];
}

export interface UseValidatorAggregator {
  validateAllFields: () => Promise<ValidatorMethodObject[]>;
  registerValidator: (validator: ValidatorMethodType) => void;
  invalidFields: Ref<UseValidatorAggregatorState['invalidFields']>;
  validators: Ref<UseValidatorAggregatorState['validators']>;
  registerInvalidFields: (validMeta: boolean, fieldUniqueId: string, name: string) => void;
  resetInvalidFields: () => void;
}

export type UseValidatorAggregatorReturn = (type: string) => UseValidatorAggregator;
