import {
  UseValidatorAggregatorPropertiesReturn,
  UseValidatorAggregatorPropertiesState,
  ValidatorMethodType,
} from './types';

export const useValidatorAggregatorProperties: UseValidatorAggregatorPropertiesReturn = () => {
  const state = useState<UseValidatorAggregatorPropertiesState>(`useValidatorAggregatorProperties`, () => ({
    invalidFields: [],
    validators: [],
  }));

  const registerValidator = (validator: ValidatorMethodType) => {
    state.value.validators.push(validator);
  };

  const registerInvalidFields = (validMeta: boolean, orderProperty: string) => {
    const invalidFields = new Set(state.value.invalidFields);
    validMeta ? invalidFields.delete(orderProperty) : invalidFields.add(orderProperty);
    state.value.invalidFields = [...invalidFields];
  };

  const validateAllFields = async () => {
    return Promise.all(state.value.validators.map((validator: ValidatorMethodType) => validator()));
  };

  return {
    ...toRefs(state.value),
    registerValidator,
    registerInvalidFields,
    validateAllFields,
  };
};
