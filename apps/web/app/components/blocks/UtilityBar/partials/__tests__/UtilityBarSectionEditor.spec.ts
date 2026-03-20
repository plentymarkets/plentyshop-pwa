import { mount } from '@vue/test-utils';
import type { UtilityBarSection } from '~/components/blocks/UtilityBar/types';
import UtilityBarSectionEditor from '../UtilityBarSectionEditor.vue';

describe('UtilityBarSectionEditor', () => {
  const sections: UtilityBarSection[] = [
    { id: 'logo', name: 'UtilityBarLogo', visible: true },
    { id: 'search', name: 'UtilityBarSearch', visible: true },
  ];

  const TestSectionForm = defineComponent({
    name: 'TestSectionForm',
    props: {
      uuid: {
        type: String,
        required: false,
        default: undefined,
      },
    },
    template: '<div data-testid="test-section-form">{{ uuid }}</div>',
  });

  it('should render section form when editingSectionIndex is defined and points to existing section', () => {
    const wrapper = mount(UtilityBarSectionEditor, {
      props: {
        sections,
        editingSectionIndex: 1,
        uuid: 'utility-section-uuid',
        sectionForm: TestSectionForm,
      },
    });

    const sectionForm = wrapper.getByTestId('test-section-form');
    expect(sectionForm.text()).toBe('utility-section-uuid');
  });

  it('should not render when editingSectionIndex is undefined', () => {
    const wrapper = mount(UtilityBarSectionEditor, {
      props: {
        sections,
        editingSectionIndex: undefined,
        uuid: 'utility-section-uuid',
        sectionForm: TestSectionForm,
      },
    });

    expect(wrapper.find('[data-testid="test-section-form"]').exists()).toBe(false);
    expect(wrapper.html()).toBe('<!--v-if-->');
  });

  it('should not render when editingSectionIndex points to non-existing section', () => {
    const wrapper = mount(UtilityBarSectionEditor, {
      props: {
        sections,
        editingSectionIndex: 99,
        uuid: 'utility-section-uuid',
        sectionForm: TestSectionForm,
      },
    });

    expect(wrapper.find('[data-testid="test-section-form"]').exists()).toBe(false);
    expect(wrapper.html()).toBe('<!--v-if-->');
  });
});
