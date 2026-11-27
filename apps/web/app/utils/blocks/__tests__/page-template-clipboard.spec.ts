import { describe, it, expect } from 'vitest';
import type { Block } from '@plentymarkets/shop-api';
import {
  PAGE_TEMPLATE_CLIPBOARD_KIND,
  PAGE_TEMPLATE_CLIPBOARD_VERSION,
  parsePageTemplate,
  regenerateBlockUuids,
  serializePageTemplate,
} from '../page-template-clipboard';

const block = (name: string, uuid: string, content: unknown = []): Block =>
  ({ name, type: 'content', meta: { uuid }, content }) as unknown as Block;

describe('page-template-clipboard', () => {
  it('should round-trip blocks through serialize and parse', () => {
    const blocks = [block('Banner', 'a')];
    expect(parsePageTemplate(serializePageTemplate(blocks))).toEqual(blocks);
  });

  it('should exclude header and footer containers', () => {
    const blocks = [block('HeaderContainer', 'h'), block('Banner', 'a'), block('FooterContainer', 'f')];
    expect(parsePageTemplate(serializePageTemplate(blocks))?.map((b) => b.name)).toEqual(['Banner']);
  });

  it('should regenerate uuids at every depth', () => {
    const blocks = [block('MultiGrid', 'a', [block('Text', 'b')])];
    regenerateBlockUuids(blocks);
    const child = (blocks[0]?.content as Block[])[0];
    expect(blocks[0]?.meta.uuid).not.toBe('a');
    expect(child?.meta.uuid).not.toBe('b');
  });

  it.each([
    ['plain text', 'hello'],
    ['wrong kind', JSON.stringify({ kind: 'x', version: PAGE_TEMPLATE_CLIPBOARD_VERSION, blocks: [] })],
    ['wrong version', JSON.stringify({ kind: PAGE_TEMPLATE_CLIPBOARD_KIND, version: 99, blocks: [] })],
    [
      'missing blocks',
      JSON.stringify({ kind: PAGE_TEMPLATE_CLIPBOARD_KIND, version: PAGE_TEMPLATE_CLIPBOARD_VERSION }),
    ],
  ])('should return null for %s', (_label, text) => {
    expect(parsePageTemplate(text)).toBeNull();
  });
});
