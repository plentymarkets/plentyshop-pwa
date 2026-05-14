export default {
  /** @description Enables the new popover for adding blocks & presets  */
  enableAddBlockPopover: process.env?.ENABLE_ADD_BLOCK_POPOVER === '1',
  /** @description Enables the new MultiGrid editor with visual column resizing, row management and free-space display. */
  enableMultiGridEditor: process.env?.ENABLE_MULTI_GRID_EDITOR === '1',
};
