import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { I18nPlaceholderNode } from '../i18nPlaceholderExtension';

vi.mock('@tiptap/vue-3', async () => {
  const actual = await vi.importActual<typeof import('@tiptap/vue-3')>('@tiptap/vue-3');

  return {
    ...actual,
    VueNodeViewRenderer: vi.fn(),
  };
});

describe('i18nPlaceholderExtension', () => {
  it('should serialize compact placeholder HTML without a redundant label attribute', () => {
    const renderHTML = I18nPlaceholderNode.config.renderHTML;
    const node = {
      attrs: {
        key: 'account.accountSettings.edit',
        label: 'account.accountSettings.edit',
      },
    } as unknown as ProseMirrorNode;

    const html = renderHTML?.call(
      {
        name: 'i18nPlaceholder',
        options: { HTMLAttributes: {} },
        storage: {},
        parent: undefined,
      },
      {
        node,
        HTMLAttributes: {},
      },
    );

    expect(html).toEqual([
      'span',
      {
        'data-i18n-key': 'account.accountSettings.edit',
        title: 'i18n: account.accountSettings.edit',
        class: 'rte-i18n-placeholder',
        contenteditable: 'false',
      },
      'edit',
    ]);
  });
});
