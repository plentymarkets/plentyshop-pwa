import type { Block } from '@plentymarkets/shop-api';
interface AddFooterBlockOptions {
  data: Ref<Block[]>;
  cachedFooter: Ref<unknown>;
  t: (key: string) => string;
  uuid: () => string;
  cleanData?: Ref<Block[]>;
}

export function addFooterBlock({ data, cachedFooter, t, uuid, cleanData }: AddFooterBlockOptions) {
  const footerExists = data.value.some((block) => block.name === 'Footer');
  if (!footerExists) {
    const footerBlock = {
      name: 'Footer',
      type: 'content',
      meta: {
        uuid: uuid(),
        isGlobalTemplate: true,
      },
      content: cachedFooter.value || {
        column1: { title: t('categories.legal.label') },
        column2: { title: t('categories.contact.label'), description: '', showContactLink: true },
        column3: { title: '', description: '' },
        column4: { title: '', description: '' },
        footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
        footnoteAlign: 'right',
        colors: {
          background: '#cfe4ec',
          text: '#1c1c1c',
          footnoteBackground: '#161a16',
          footnoteText: '#959795',
        },
      },
    };
    data.value.push(footerBlock);
    if (cleanData) {
      cleanData.value.push(JSON.parse(JSON.stringify(footerBlock)));
    }
  }
}
