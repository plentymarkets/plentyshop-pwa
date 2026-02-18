import type { AnnouncementBarProps } from '../types';

export const mockAnnouncementBar: AnnouncementBarProps = {
  name: 'AnnouncementBar',
  type: 'block',
  meta: { uuid: '123e4567-e89b-12d3-a456-426614174000' },
  content: [
    {
      name: 'Announcement 1',
      type: 'content',
      meta: { uuid: '123e4567-e89b-12d3-a456-426614174001' },
      content: {
        text: '<p>Free shipping on orders over $50</p>',
        visible: true,
      },
    },
    {
      name: 'Announcement 2',
      type: 'content',
      meta: { uuid: '123e4567-e89b-12d3-a456-426614174002' },
      content: {
        text: '<p>Summer sale – up to 30% off</p>',
        visible: true,
      },
    },
    {
      name: 'Announcement 3',
      type: 'content',
      meta: { uuid: '123e4567-e89b-12d3-a456-426614174003' },
      content: {
        text: '<p>Hidden item</p>',
        visible: false,
      },
    },
  ],
  configuration: {
    controls: {
      color: '#ffffff',
    },
    layout: {
      fullWidth: true,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#1a1a1a',
    },
  },
};
