export default {
  /** @description Enables the new withdrawal button from the footer */
  enableContractWithdrawalButton: process.env?.ENABLE_CONTRACT_WITHDRAWAL_BUTTON === '1',
  enableCancellationForm: process.env?.ENABLE_CANCELLATION_FORM === '1',

};
