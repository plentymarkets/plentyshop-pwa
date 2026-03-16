import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import UtilityBarLogoForm from '../UtilityBarLogoForm.vue';

const { usePickerHelperMock, useSiteSettingsMock, useImageAddMock, getEditorTranslationMock } = vi.hoisted(() => {
  return {
    usePickerHelperMock: vi.fn(),
    useSiteSettingsMock: vi.fn(),
    useImageAddMock: vi.fn(),
    getEditorTranslationMock: vi.fn((key: string) => key),
  };
});

mockNuxtImport('usePickerHelper', () => usePickerHelperMock);
mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);
mockNuxtImport('useImageAdd', () => useImageAddMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

describe('UtilityBarLogoForm', () => {
  const placeholderImg = '/placeholder-logo.svg';
  const currentLogo = '/header-logo.svg';
  const updateSetting = vi.fn();
  const getSetting = vi.fn();
  const handleImageAdd = vi.fn();

  const UiImagePickerStub = defineComponent({
    name: 'UiImagePicker',
    props: {
      label: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
        default: '',
      },
      placeholder: {
        type: String,
        required: true,
      },
      dimensions: {
        type: String,
        required: true,
      },
      tooltip: {
        type: String,
        required: true,
      },
      selectedImageType: {
        type: String,
        required: true,
      },
      customLabel: {
        type: String,
        required: true,
      },
    },
    emits: ['add', 'delete'],
    template: '<div data-testid="ui-image-picker-stub" />',
  });

  beforeEach(() => {
    vi.clearAllMocks();

    getSetting.mockReturnValue(currentLogo);

    usePickerHelperMock.mockReturnValue({
      placeholderImg,
    });

    useSiteSettingsMock.mockReturnValue({
      updateSetting,
      getSetting,
    });

    useImageAddMock.mockReturnValue({
      handleImageAdd,
    });
  });

  it('should render image picker with expected props from settings and translations', () => {
    const wrapper = mount(UtilityBarLogoForm, {
      global: {
        stubs: {
          UiImagePicker: UiImagePickerStub,
        },
      },
    });

    const imagePicker = wrapper.getComponent(UiImagePickerStub);

    expect(imagePicker.props('label')).toBe('label');
    expect(imagePicker.props('image')).toBe(currentLogo);
    expect(imagePicker.props('placeholder')).toBe(placeholderImg);
    expect(imagePicker.props('dimensions')).toBe('description');
    expect(imagePicker.props('tooltip')).toBe('tooltip');
    expect(imagePicker.props('selectedImageType')).toBe('Logo');
    expect(imagePicker.props('customLabel')).toBe('Change Logo');
  });

  it('should call handleImageAdd when add event is emitted', async () => {
    const wrapper = mount(UtilityBarLogoForm, {
      global: {
        stubs: {
          UiImagePicker: UiImagePickerStub,
        },
      },
    });

    const imagePicker = wrapper.getComponent(UiImagePickerStub);
    const payload = { url: '/new-logo.svg' };

    imagePicker.vm.$emit('add', payload);
    await nextTick();

    expect(handleImageAdd).toHaveBeenCalledWith(payload);
  });

  it('should reset logo to placeholder image when delete event is emitted', async () => {
    const wrapper = mount(UtilityBarLogoForm, {
      global: {
        stubs: {
          UiImagePicker: UiImagePickerStub,
        },
      },
    });

    const imagePicker = wrapper.getComponent(UiImagePickerStub);

    imagePicker.vm.$emit('delete');
    await nextTick();

    expect(updateSetting).toHaveBeenCalledWith(placeholderImg);
  });
});
