export default {
  /** @description Enables the new withdrawal button from the footer */
  enableContractWithdrawalButton: process.env?.ENABLE_CONTRACT_WITHDRAWAL_BUTTON === '1',
  /** @description Enables the new menu entry in settings for cancellation email  */
  enableCancellationForm: process.env?.ENABLE_CANCELLATION_FORM === '1',
  /** @description Skips the getInit SSR call for performance benchmarking */
  mockGetInit: process.env?.MOCK_GET_INIT === '1',
  /** @description Skips the getSettings SSR call for performance benchmarking */
  mockGetSettings: process.env?.MOCK_GET_SETTINGS === '1',
};
