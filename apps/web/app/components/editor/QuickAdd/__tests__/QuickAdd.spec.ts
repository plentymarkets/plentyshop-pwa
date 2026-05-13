import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import QuickAdd from '../QuickAdd.vue';
import type { QuickAddOption } from '../types';

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: { enableQuickAdd: true },
}));

mockNuxtImport('getBlockIconSvg', () => (blockName: string) => {
  if (blockName === 'Image') return '<svg>icon</svg>';
  return null;
});

const options: QuickAddOption[] = [
  { blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 },
  { blockName: 'TextCard', label: 'Rich Text', category: 'text', variationIndex: 0 },
  { blockName: 'MultiGrid', label: 'Layout', category: 'layout', variationIndex: 0 },
];

const createWrapper = (props: { options: QuickAddOption[] }) => {
  return mount(QuickAdd, {
    props,
    global: {
      stubs: {
        NuxtImg: true,
      },
    },
  });
};

describe('QuickAdd', () => {
  it('should render buttons for each option', () => {
    const wrapper = createWrapper({ options });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('should display option labels', () => {
    const wrapper = createWrapper({ options });

    expect(wrapper.text()).toContain('Image');
    expect(wrapper.text()).toContain('Rich Text');
    expect(wrapper.text()).toContain('Layout');
  });

  it('should emit "add" with the option when a button is clicked', async () => {
    const wrapper = createWrapper({ options });

    await wrapper.find('[data-testid="quick-add-Image"]').trigger('click');

    expect(wrapper.emitted('add')).toHaveLength(1);
    expect(wrapper.emitted('add')![0]).toEqual([options[0]]);
  });

  it('should render inline SVG when getBlockIconSvg returns a value', () => {
    const wrapper = createWrapper({ options });

    const imageButton = wrapper.find('[data-testid="quick-add-Image"]');
    expect(imageButton.find('span').html()).toContain('<svg>icon</svg>');
  });

  it('should render NuxtImg fallback when getBlockIconSvg returns null', () => {
    const wrapper = createWrapper({ options });

    const textButton = wrapper.find('[data-testid="quick-add-TextCard"]');
    expect(textButton.find('nuxt-img-stub').exists()).toBe(true);
  });

  it('should not render when options array is empty', () => {
    const wrapper = createWrapper({ options: [] });

    expect(wrapper.find('div').exists()).toBe(false);
  });
});
