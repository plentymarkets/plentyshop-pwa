import { v4 as uuid } from 'uuid';
import type { BlocksList } from '~/composables/useBlocksList/types';

const baseContent = (overrides: { text: string; backgroundColor: string; textColor: string; speed: number }) => ({
  name: 'RetroMarquee',
  type: 'content' as const,
  configuration: { visible: true },
  content: overrides,
});

export const getBlocksList = (): BlocksList => ({
  retroMarquee: {
    title: 'Retro Marquee',
    blockName: 'RetroMarquee',
    category: 'retroMarquee',
    accessControl: ['content'],
    variations: [
      {
        title: 'Sunshine Comic',
        image: 'https://placehold.co/200x80/FFE066/161A16?text=MARQUEE&font=roboto',
        template: {
          en: {
            ...baseContent({
              text: '*** Welcome to my homepage! Best viewed in Netscape Navigator ***',
              backgroundColor: '#FFE066',
              textColor: '#161A16',
              speed: 20,
            }),
            meta: { uuid: 'a1b2c3d4-1111-4aaa-8bbb-000000000001' },
          },
          de: {
            ...baseContent({
              text: '*** Willkommen auf meiner Homepage! Am besten im Netscape Navigator ***',
              backgroundColor: '#FFE066',
              textColor: '#161A16',
              speed: 20,
            }),
            meta: { uuid: 'a1b2c3d4-1111-4aaa-8bbb-000000000002' },
          },
        },
      },
      {
        title: 'Cyberpunk Neon',
        image: 'https://placehold.co/200x80/0F0F23/FF00FF?text=NEON&font=roboto',
        template: {
          en: {
            ...baseContent({
              text: '>>> Cyberpunk vibes only — system online <<<',
              backgroundColor: '#0F0F23',
              textColor: '#FF00FF',
              speed: 12,
            }),
            meta: { uuid: 'a1b2c3d4-2222-4aaa-8bbb-000000000001' },
          },
          de: {
            ...baseContent({
              text: '>>> Nur Cyberpunk-Vibes — System online <<<',
              backgroundColor: '#0F0F23',
              textColor: '#FF00FF',
              speed: 12,
            }),
            meta: { uuid: 'a1b2c3d4-2222-4aaa-8bbb-000000000002' },
          },
        },
      },
    ],
  },
});

export const createDefault = () =>
  baseContent({
    text: '*** Default Marquee ***',
    backgroundColor: '#FFE066',
    textColor: '#161A16',
    speed: 20,
  });
