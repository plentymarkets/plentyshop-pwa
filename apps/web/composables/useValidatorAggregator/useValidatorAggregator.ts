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

  const validateAllFields = async () => {
    return Promise.all(state.value.validators.map((validator: ValidatorMethodType) => validator()));
  };

  return {
    ...toRefs(state.value),
    registerValidator,
    validateAllFields,
  };
};
