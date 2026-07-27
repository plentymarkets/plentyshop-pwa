import { v4 as uuid } from 'uuid';
import type { AnnouncementBarProps } from './types';
import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList } from '~/composables/useBlocksList/types';

const ANNOUNCEMENT_BAR_IMAGE = 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/announcement-bar.svg';

const createAnnouncementBar = (text: string): AnnouncementBarProps => ({
  name: 'AnnouncementBar',
  type: 'content',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
  },
  content: {
    backgroundColor: '#EDFF6C',
    text,
  },
});

const createAnnouncementCarousel = (firstText: string, secondText: string): Block => ({
  name: 'Carousel',
  type: 'structure',
  meta: { uuid: uuid() },
  configuration: {
    controls: {
      color: '#000000',
      displayIndicators: false,
    },
    layout: {
      fullWidth: true,
    },
    visible: true,
  },
  content: [createAnnouncementBar(firstText), createAnnouncementBar(secondText)],
});

export const getBlocksList = (): BlocksList => ({
  header: {
    category: 'header',
    accessControl: ['content'],
    title: 'Header',
    blockName: 'Header',
    variations: [
      {
        title: 'Announcement Bar',
        image: ANNOUNCEMENT_BAR_IMAGE,
        template: {
          en: createAnnouncementCarousel('This is an example announcement.', 'This is another example announcement.'),
          de: createAnnouncementCarousel(
            'Dies ist eine Beispielankündigung.',
            'Dies ist eine weitere Beispielankündigung.',
          ),
        },
      },
    ],
  },
});

export const createDefault = (): AnnouncementBarProps => {
  return createAnnouncementBar('This is an example announcement.');
};

export const labelPath = 'content.text';
