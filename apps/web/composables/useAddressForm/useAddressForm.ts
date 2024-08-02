import { type Address, AddressType } from '@plentymarkets/shop-api';
import { type OnValidationEnd } from './types';
import { EventEmitter } from 'node:events';

const eventEmitter = new EventEmitter();

const clearAllListeners = () => {
  eventEmitter.removeAllListeners();
};

const emit = (event: string, payload: OnValidationEnd) => {
  eventEmitter.emit(event, { event, payload });
};

export const useAddressForm = (type: AddressType) => {
  const { create } = useCreateAddress(type);

  const EVENTS = {
    VALIDATION_START: `addressForm.${type}.validationStart`,
    VALIDATION_DONE: `addressForm.${type}.validationDone`,
  };

  const state = useState('useAddressForm' + type, () => ({
    isLoading: false,
    open: false,
    addressToSave: {},
  }));

  const startValidation = () => {
    eventEmitter.emit(EVENTS.VALIDATION_START);
  };

  const endValidation = (onValidationEnd: OnValidationEnd) => {
    emit(EVENTS.VALIDATION_DONE, onValidationEnd);
  };

  const onStartValidation = (listener: (event: string) => void) => {
    eventEmitter.on(EVENTS.VALIDATION_START, listener);
    return () => eventEmitter.off(EVENTS.VALIDATION_START, listener);
  };

  const onEndValidation = (listener: (event: OnValidationEnd) => void) => {
    eventEmitter.on(EVENTS.VALIDATION_DONE, listener);
    return () => eventEmitter.off(EVENTS.VALIDATION_DONE, listener);
  };

  /**
   * Triggers the forms validation and saves the address if it is valid
   */
  const save = async (combineShippingAndBilling = false) => {
    state.value.isLoading = true;

    startValidation();

    onEndValidation(async (event: OnValidationEnd) => {
      if (event.validation.valid) {
        await create(event.address as Address);
        state.value.open = false;
        state.value.isLoading = false;
        return true;
      } else {
        state.value.isLoading = false;
        return false;
      }
    });
  };

  const saveShippingAndBilling = () => {
    return save(true);
  };

  return {
    save,
    saveShippingAndBilling,
    clearAllListeners,
    endValidation,
    onStartValidation,
    ...toRefs(state.value),
  };
};
