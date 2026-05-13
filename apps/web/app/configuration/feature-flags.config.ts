export default {
  /** @description Enables the new withdrawal button from the footer */
  enableContractWithdrawalButton: process.env?.ENABLE_CONTRACT_WITHDRAWAL_BUTTON === '1',
  /** @description Enables the new menu entry in settings for cancellation email  */
  enableCancellationForm: process.env?.ENABLE_CANCELLATION_FORM === '1',
  /** @description Enables the new popover for adding blocks & presets  */
  enableAddBlockPopover: process.env?.ENABLE_ADD_BLOCK_POPOVER === '1',
  /** @description Enables the new MultiGrid editor with visual column resizing, row management and free-space display. */
  enableMultiGridEditor: process.env?.ENABLE_MULTI_GRID_EDITOR === '1',
};
