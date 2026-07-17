import { mount } from '@vue/test-utils';
import type { Editor, NodeViewProps } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import I18nPlaceholderView from '../I18nPlaceholderView.vue';

vi.mock('@tiptap/vue-3', async () => {
  const actual = await vi.importActual<typeof import('@tiptap/vue-3')>('@tiptap/vue-3');

  return {
    ...actual,
    NodeViewWrapper: {
      props: ['as'],
      template: '<component :is="as || \'div\'"><slot /></component>',
    },
    nodeViewProps: {
      node: {
        type: Object,
        required: true,
      },
    },
  };
});

describe('I18nPlaceholderView', () => {
  it('should show a short label and expose the full key on hover', () => {
    const node = {
      attrs: {
        key: 'account.accountSettings.billingDetails.billingAddress',
        label: 'account.accountSettings.billingDetails.billingAddress',
      },
    } as unknown as ProseMirrorNode;
    const nodeViewPropsMock = {
      editor: {} as Editor,
      node,
      decorations: [] as unknown as NodeViewProps['decorations'],
      selected: false,
      extension: {} as NodeViewProps['extension'],
      getPos: () => 0,
      updateAttributes: vi.fn(),
      deleteNode: vi.fn(),
      view: {} as NodeViewProps['view'],
      innerDecorations: {} as NodeViewProps['innerDecorations'],
      HTMLAttributes: {},
    } satisfies NodeViewProps;

    const wrapper = mount(I18nPlaceholderView, {
      props: nodeViewPropsMock,
    });

    expect(wrapper.text()).toContain('i18n');
    expect(wrapper.text()).toContain('billingAddress');
    expect(wrapper.text()).not.toContain('account.accountSettings.billingDetails.billingAddress');
    expect(wrapper.attributes('title')).toBe('i18n: account.accountSettings.billingDetails.billingAddress');
  });
});
