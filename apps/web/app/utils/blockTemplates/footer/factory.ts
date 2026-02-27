import type { Block } from '@plentymarkets/shop-api';
import type { FooterContent } from './interface';

export function createFooter(content: FooterContent): Block {
  return {
    name: 'Footer',
    type: 'content',
    meta: {
      uuid: '4f7e2b1a-9c8d-4e6f-b3a2-1d0c5b4a3e2f',
      isGlobalTemplate: true,
    },
    content: {
      column1: {
        title: content.column1.title,
      },
      column2: {
        title: content.column2.title,
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
