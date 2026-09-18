import { v4 as uuid } from 'uuid';
import type { Block } from '@plentymarkets/shop-api';

const createDetailsListItem = (htmlDescription: string): Block => ({
  name: 'TextCard',
  type: 'content',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
    detailsSettings: {
      label: '',
      defaultOpen: false,
    },
  },
  content: {
    text: {
      htmlDescription,
      textAlignment: 'left',
      color: '#000',
    },
    button: {
      label: '',
      link: '',
      variant: 'primary',
    },
    layout: {
      fullWidth: false,
    },
  },
});

const createDetailsList = (htmlDescription: string): Block => ({
  name: 'DetailsList',
  type: 'structure',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
    layout: {
      fullWidth: false,
    },
  },
  content: [createDetailsListItem(htmlDescription)],
});

export const getBlocksList = (): BlocksList => ({
  accordion: {
    category: 'accordion',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'DetailsList',
    blockName: 'DetailsList',
    variations: [
      {
        title: 'DetailsList',
        template: {
          en: createDetailsList('<p style="text-align: left;">Add your item content here.</p>'),
          de: createDetailsList('<p style="text-align: left;">Fügen Sie hier Ihren Inhalt hinzu.</p>'),
        },
      },
    ],
  },
});

export const createDefault = (): Block =>
  createDetailsList('<p style="text-align: left;">Add your item content here.</p>');
