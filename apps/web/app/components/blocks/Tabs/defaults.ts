import { v4 as uuid } from 'uuid';
import type { Block } from '@plentymarkets/shop-api';

const createTabTextCard = (htmlDescription: string): Block => ({
  name: 'TextCard',
  type: 'content',
  meta: { uuid: uuid() },
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

const createTabs = (htmlDescription: string): Block => ({
  name: 'Tabs',
  type: 'structure',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
    layout: {
      fullWidth: false,
      showBorderUnderTabs: true,
      tabsAlignment: 'left',
    },
  },
  content: [createTabTextCard(htmlDescription)],
});

export const getBlocksList = (): BlocksList => ({
  tabs: {
    category: 'tabs',
    accessControl: ['content', 'productCategory', 'product'],
    title: 'Tabs',
    blockName: 'Tabs',
    variations: [
      {
        title: 'Tabs',
        template: {
          en: createTabs('<p style="text-align: left;">Add your tab content here.</p>'),
          de: createTabs('<p style="text-align: left;">Fügen Sie hier Ihren Tab-Inhalt hinzu.</p>'),
        },
      },
    ],
  },
});

export const createDefault = (): Block => createTabs('<p style="text-align: left;">Add your tab content here.</p>');
