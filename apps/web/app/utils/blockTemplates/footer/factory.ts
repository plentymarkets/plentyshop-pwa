import type { Block } from '@plentymarkets/shop-api';

export function createFooter(): Block {
  const column1Title = t('defaultTemplate.footer.column1.title');
  const column2Title = t('defaultTemplate.footer.column2.title');

  return {
    name: 'Footer',
    type: 'content',
    meta: {
      uuid: '4f7e2b1a-9c8d-4e6f-b3a2-1d0c5b4a3e2f',
      isGlobalTemplate: true,
    },
    content: {
      column1: {
        title: column1Title,
      },
      column2: {
        title: column2Title,
        showContactLink: true,
        htmlDescription: "<ul><li><a href='https://plentyshop.plentymarkets.com/contact'></a></li></ul>",
      },
      column3: {
        title: '',
        htmlDescription: '',
      },
      column4: {
        title: '',
        htmlDescription: '',
      },
      footnote: '',
      footnoteAlign: 'right',
      colors: {
        background: '#cfe4ec',
        text: '#151a16',
        footnoteBackground: '#151a16',
        footnoteText: '#8b8d8b',
      },
    },
  };
}
