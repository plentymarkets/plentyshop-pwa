import type { TextCardContent } from '@/components/blocks/TextCard/types';

export const createOldTextCard = (overrides?: Partial<TextCardContent>): Partial<TextCardContent> => ({
  text: {
    pretitle: 'Pretitle',
    title: 'Title',
    subtitle: 'Subtitle',
    htmlDescription: 'Some description',
    textAlignment: 'center',
    color: '#fff',
    ...overrides?.text,
  },
});

export const createMigratedTextCard = (overrides?: Partial<TextCardContent>): Partial<TextCardContent> => ({
  text: {
    pretitle: '',
    title: '',
    subtitle: '',
    htmlDescription: '<h2>Pretitle</h2>\n<h1>Title</h1>\n<h3>Subtitle</h3>\n<p>Some description</p>',
    textAlignment: 'center',
    color: '#fff',
    ...overrides?.text,
  },
});
