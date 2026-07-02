export default {
  /** @description Enables the new popover for adding blocks & presets  */
  enableAddBlockPopover: true,
  /** @description Enables the new MultiGrid editor with visual column resizing, row management and free-space display. */
  enableMultiGridEditor: true,
  /** @description Enables quick-add pills in structure block forms (Header, Footer, MultiGrid) */
  enableQuickAdd: true,
  /** @description Enables the AI text-generation assistant (the "AI" button above the rich text editor). Disabled until the feature is released. */
  enableAiTextGeneration: process.env.ENABLE_AI_TEXT_GENERATION === 'true' || false,
};
