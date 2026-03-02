import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

export function createFooter(): Block {
  const column1Title = t('defaultTemplate.footer.column1.title');
  const column2Title = t('defaultTemplate.footer.column2.title');

  return {
    name: 'Footer',
    type: 'content',
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    content: {
      column1: {
        title: column1Title,
      },
      column2: {
        title: column2Title,
        showContactLink: true,
      },
      column3: {
        title: '',
      },
      column4: {
        title: '',
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
