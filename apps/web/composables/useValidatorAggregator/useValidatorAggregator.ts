import {
  UseValidatorAggregatorPropertiesReturn,
  UseValidatorAggregatorPropertiesState,
  ValidatorMethodType,
} from './types';

/**
 * @description Composable for managing form validation.
 * @returns UseValidatorAggregatorPropertiesReturn
 * @example
 * ``` ts
 * const {
 *   invalidFields, validators, registerValidator, registerInvalidFields, validateAllFields
 * } = useValidatorAggregatorProperties();
 * ```
 */
export const useValidatorAggregatorProperties: UseValidatorAggregatorPropertiesReturn = () => {
  const state = useState<UseValidatorAggregatorPropertiesState>(`useValidatorAggregatorProperties`, () => ({
    invalidFields: [],
    validators: [],
  }));

  /** @description Function for registering field validator.
   * @param validator { ValidatorMethodType }
   * @return void
   * @example
   * ``` ts
   * registerValidator({
   *   valid: true
   * });
   * ```
   */
  const registerValidator = (validator: ValidatorMethodType) => {
    state.value.validators.push(validator);
  };

  /** @description Function for registering validator's invalid fields.
   * @param validMeta { boolean }
   * @param fieldUniqueId { string }
   * @param name { string }
   * @return void
   * @example
   * ``` ts
   * registerInvalidFields({
   *   true, fieldUniqueId, orderPropertyName
   * });
   * ```
   */
  const registerInvalidFields = (validMeta: boolean, fieldUniqueId: string, name: string) => {
    const invalidFields = state.value.invalidFields;

    if (validMeta) {
      const indexToRemove = invalidFields.findIndex((invalidField) => invalidField.key === fieldUniqueId);
      if (indexToRemove !== -1) {
        invalidFields.splice(indexToRemove, 1);
      }
    } else {
      const existingField = invalidFields.find((invalidField) => invalidField.key === fieldUniqueId);
      if (existingField) {
        existingField.name = name;
      } else {
        invalidFields.push({ key: fieldUniqueId, name });
      }
    }

    state.value.invalidFields = invalidFields;
  };

  /** @description Function for validating fields.
   * @return Promise
   * @example
   * ``` ts
   * validateAllFields();
   * ```
   */
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
