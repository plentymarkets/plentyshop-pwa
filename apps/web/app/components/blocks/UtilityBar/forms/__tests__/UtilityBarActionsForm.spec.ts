import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { ActionOrderItem, UtilityBarContent } from '~/components/blocks/UtilityBar/types';
import UtilityBarActionsForm from '../UtilityBarActionsForm.vue';

const { useUtilityBarStateMock, getEditorTranslationMock } = vi.hoisted(() => {
  return {
    useUtilityBarStateMock: vi.fn(),
    getEditorTranslationMock: vi.fn((key: string) => key),
  };
});

mockNuxtImport('useUtilityBarState', () => useUtilityBarStateMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const createContent = (): UtilityBarContent => ({
  layout: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
  sectionOrder: { sections: ['logo', 'search', 'actions'] },
  sectionVisibility: { logo: true, search: true, actions: true },
  color: { iconColor: '#fff', backgroundColor: 'rgb(var(--colors-2-primary-500))' },
  logo: { logo: '' },
  search: { displayMode: 'full' },
  actions: {
    order: ['language', 'wishlist', 'cart', 'account'],
    visibility: {
      language: true,
      wishlist: false,
      cart: true,
      account: true,
    },
  },
});

describe('UtilityBarActionsForm', () => {
  const content = ref<UtilityBarContent>(createContent());

  const DraggableStub = defineComponent({
    name: 'draggable',
    props: {
      modelValue: {
        type: Array,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    template:
      '<div data-testid="draggable-stub"><slot name="item" v-for="element in modelValue" :element="element" :key="element.id" /></div>',
  });

  const SfSwitchStub = defineComponent({
    name: 'SfSwitch',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:model-value'],
    template:
      '<button data-testid="switch-stub" @click="$emit(\'update:model-value\', !modelValue)">{{ modelValue }}</button>',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    content.value = createContent();

    useUtilityBarStateMock.mockReturnValue({
      content,
    });
  });

  it('should render all actions in configured order', () => {
    const wrapper = mount(UtilityBarActionsForm, {
      props: { uuid: 'utility-actions-form-uuid' },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          NuxtImg: true,
          draggable: DraggableStub,
          SfSwitch: SfSwitchStub,
        },
      },
    });

    const labels = wrapper.findAll('span.text-sm.font-medium').map((item) => item.text());

    expect(labels).toEqual([
      'language-action-label',
      'wishlist-action-label',
      'cart-action-label',
      'account-action-label',
    ]);
  });

  it('should toggle action visibility when switch is clicked', async () => {
    const wrapper = mount(UtilityBarActionsForm, {
      props: { uuid: 'utility-actions-form-uuid' },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          NuxtImg: true,
          draggable: DraggableStub,
          SfSwitch: SfSwitchStub,
        },
      },
    });

    const switches = wrapper.findAll('[data-testid="switch-stub"]');
    const wishlistSwitch = switches[1];

    expect(wishlistSwitch).toBeDefined();
    await wishlistSwitch!.trigger('click');

    expect(content.value.actions.visibility.wishlist).toBe(true);
  });

  it('should update order and visibility when draggable emits a new value', async () => {
    const wrapper = mount(UtilityBarActionsForm, {
      props: { uuid: 'utility-actions-form-uuid' },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          NuxtImg: true,
          draggable: DraggableStub,
          SfSwitch: SfSwitchStub,
        },
      },
    });

    const reordered: ActionOrderItem[] = [
      { id: 'cart', visible: true },
      { id: 'account', visible: false },
      { id: 'language', visible: true },
      { id: 'wishlist', visible: true },
    ];

    const draggable = wrapper.getComponent(DraggableStub);
    draggable.vm.$emit('update:modelValue', reordered);
    await nextTick();

    expect(content.value.actions.order).toEqual(['cart', 'account', 'language', 'wishlist']);
    expect(content.value.actions.visibility).toEqual({
      language: true,
      wishlist: true,
      cart: true,
      account: false,
    });
  });
});
