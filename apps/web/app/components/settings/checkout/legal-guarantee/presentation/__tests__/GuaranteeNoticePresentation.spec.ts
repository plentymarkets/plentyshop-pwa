import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import GuaranteeNoticePresentation from '../GuaranteeNoticePresentation.vue';

const { useSiteSettingsMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn(),
}));

mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);
mockNuxtImport('getEditorTranslation', () => (key: string) => key);

describe('GuaranteeNoticePresentation', () => {
  const getSetting = vi.fn();
  const updateSetting = vi.fn();
  const getBooleanSetting = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    getSetting.mockReturnValue('');
    getBooleanSetting.mockReturnValue(true);
    useSiteSettingsMock.mockImplementation((key: string) =>
      key === GUARANTEE_NOTICE_DISPLAY_MODE_SETTING ? { getSetting, updateSetting } : { getBooleanSetting },
    );
  });

  it('should default to the link and dialog when no mode is saved', () => {
    const wrapper = mount(GuaranteeNoticePresentation);

    expect(useSiteSettingsMock).toHaveBeenCalledWith(GUARANTEE_NOTICE_DISPLAY_MODE_SETTING);
    expect(wrapper.find('select').element.value).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.Modal);
  });

  it('should fall back to the link and dialog for an unknown mode', () => {
    getSetting.mockReturnValue('unknown');

    const wrapper = mount(GuaranteeNoticePresentation);

    expect(wrapper.find('select').element.value).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.Modal);
  });

  it('should display and stage the inline mode', async () => {
    getSetting.mockReturnValue(GUARANTEE_NOTICE_DISPLAY_MODE.Inline);
    const wrapper = mount(GuaranteeNoticePresentation);

    expect(wrapper.find('select').element.value).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.Inline);

    await wrapper.find('select').setValue(GUARANTEE_NOTICE_DISPLAY_MODE.Modal);

    expect(updateSetting).toHaveBeenCalledWith(GUARANTEE_NOTICE_DISPLAY_MODE.Modal);
  });

  it('should default to none when the legacy switch was disabled', () => {
    getBooleanSetting.mockReturnValue(false);

    const wrapper = mount(GuaranteeNoticePresentation);

    expect(wrapper.find('select').element.value).toBe(GUARANTEE_NOTICE_DISPLAY_MODE.None);
  });

  it('should save none as the selected display mode', async () => {
    const wrapper = mount(GuaranteeNoticePresentation);

    await wrapper.find('select').setValue(GUARANTEE_NOTICE_DISPLAY_MODE.None);

    expect(updateSetting).toHaveBeenCalledWith(GUARANTEE_NOTICE_DISPLAY_MODE.None);
  });
});
