export const GUARANTEE_NOTICE_DISPLAY_MODE_SETTING = 'guaranteeNoticeDisplayMode';

export const GUARANTEE_NOTICE_DISPLAY_MODE = {
  Modal: 'modal',
  Inline: 'inline',
  None: 'none',
} as const;

/** Resolves an unset mode against the legacy checkout visibility setting. */
export const resolveGuaranteeNoticeDisplayMode = (mode: string, legacyVisible: boolean) => {
  if (mode === GUARANTEE_NOTICE_DISPLAY_MODE.Inline) {
    return GUARANTEE_NOTICE_DISPLAY_MODE.Inline;
  }
  if (mode === GUARANTEE_NOTICE_DISPLAY_MODE.Modal) {
    return GUARANTEE_NOTICE_DISPLAY_MODE.Modal;
  }
  if (mode === GUARANTEE_NOTICE_DISPLAY_MODE.None) {
    return GUARANTEE_NOTICE_DISPLAY_MODE.None;
  }

  return legacyVisible ? GUARANTEE_NOTICE_DISPLAY_MODE.Modal : GUARANTEE_NOTICE_DISPLAY_MODE.None;
};
