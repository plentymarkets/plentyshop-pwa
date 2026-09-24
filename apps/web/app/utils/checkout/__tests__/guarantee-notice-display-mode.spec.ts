import { GUARANTEE_NOTICE_DISPLAY_MODE, resolveGuaranteeNoticeDisplayMode } from '../guarantee-notice-display-mode';

describe('resolveGuaranteeNoticeDisplayMode', () => {
  it('should preserve the legacy hidden state when no mode is saved', () => {
    expect(resolveGuaranteeNoticeDisplayMode('', false)).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.None);
  });

  it('should default to the modal when no mode or legacy setting is saved', () => {
    expect(resolveGuaranteeNoticeDisplayMode('', true)).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.Modal);
  });

  it('should honor an explicit mode over the legacy hidden state', () => {
    expect(resolveGuaranteeNoticeDisplayMode(GUARANTEE_NOTICE_DISPLAY_MODE.Modal, false)).toBe(
      GUARANTEE_NOTICE_DISPLAY_MODE.Modal,
    );
    expect(resolveGuaranteeNoticeDisplayMode(GUARANTEE_NOTICE_DISPLAY_MODE.Inline, false)).toBe(
      GUARANTEE_NOTICE_DISPLAY_MODE.Inline,
    );
    expect(resolveGuaranteeNoticeDisplayMode(GUARANTEE_NOTICE_DISPLAY_MODE.None, true)).toBe(
      GUARANTEE_NOTICE_DISPLAY_MODE.None,
    );
  });

  it('should fall back to legacy visibility for an unknown mode', () => {
    expect(resolveGuaranteeNoticeDisplayMode('unknown', false)).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.None);
  });
});
