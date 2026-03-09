import type { Block } from '@plentymarkets/shop-api';
import { v4 as uuid } from 'uuid';

export function createHeaderSection(): Block[] {
  return [
    {
      name: 'Header',
      type: 'content',
      meta: { uuid: uuid() },
      content: { backgroundColor: '', iconColor: '' },
    },
  ];
}
