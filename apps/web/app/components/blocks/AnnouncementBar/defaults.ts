import { v4 as uuid } from 'uuid';
import type { AnnouncementBarProps } from './types';

export const createDefault = (): AnnouncementBarProps => ({
  name: 'AnnouncementBar',
  type: 'content',
  meta: { uuid: uuid() },
  configuration: {
    visible: true,
  },
  content: {
    backgroundColor: '#EDFF6C',
    text: 'This is an example announcement.',
  },
});

export const labelPath = 'content.text';
