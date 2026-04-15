export default {
  /** @description Enables the editable header block (HeaderContainer) */
  enableEditableHeader: process.env?.ENABLE_EDITABLE_HEADER === '1',
  /** @description Enables the new withdrawal button fom the footer */
  enableContractWithdrawalButton: process.env?.ENABLE_CONTRACT_WITHDRAWAL_BUTTON === '1',
};
