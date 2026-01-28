import { describe, it, expect } from 'vitest';
import { migrateTextCardContent } from '../migrate-text-editor';
import type { TextCardContent } from '@/components/blocks/TextCard/types';

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('migrateTextCardContent', () => {
  const oldStructureTextCard: Partial<TextCardContent> = {
    text: {
      pretitle: 'Pretitle',
      title: 'Title',
      subtitle: 'Subtitle',
      htmlDescription: 'Some description',
      textAlignment: 'center',
      color: '#fff',
    },
  };

  const migratedTextCard: Partial<TextCardContent> = {
    text: {
      pretitle: '',
      title: '',
      subtitle: '',
      htmlDescription: '<h2>Pretitle</h2>\n<h1>Title</h1>\n<h3>Subtitle</h3>\n<p>Some description</p>',
      textAlignment: 'center',
      color: '#fff',
    },
  };

  it('migrates old structure with all fields', () => {
    const result = migrateTextCardContent(clone(oldStructureTextCard));
    expect(result).toEqual(migratedTextCard);
  });

  it('does not migrate if pretitle, title, subtitle are empty', () => {
    expect(migrateTextCardContent(clone(migratedTextCard))).toEqual(migratedTextCard);
  });

  it('escapes HTML in pretitle, title, subtitle', () => {
    const content = clone(oldStructureTextCard);
    content.text!.pretitle = '<b>Pretitle</b>';
    content.text!.title = 'Title & "Special"';
    content.text!.subtitle = "Subtitle's";
    content.text!.htmlDescription = 'Desc';

    const result = migrateTextCardContent(content);
    expect(result.text?.htmlDescription).toContain('&lt;b&gt;Pretitle&lt;/b&gt;');
    expect(result.text?.htmlDescription).toContain('Title &amp; &quot;Special&quot;');
    expect(result.text?.htmlDescription).toContain('Subtitle&#039;s');
  });

  it('wraps htmlDescription in <p> if no HTML tags', () => {
    const result = migrateTextCardContent(clone(oldStructureTextCard));
    expect(result.text?.htmlDescription).toMatch(new RegExp(`<p>${oldStructureTextCard.text!.htmlDescription}</p>$`));
  });

  it('does not wrap htmlDescription if it already contains HTML', () => {
    const content = clone(oldStructureTextCard);
    content.text!.htmlDescription = '<ul><li>Item</li></ul>';

    const result = migrateTextCardContent(content);
    expect(result.text?.htmlDescription).toMatch(/<ul><li>Item<\/li><\/ul>$/);
  });

  it('handles missing htmlDescription', () => {
    const content: Partial<TextCardContent> = {
      text: {
        pretitle: 'P',
        title: 'T',
        subtitle: 'S',
      },
    };
    const result = migrateTextCardContent(clone(content));
    expect(result.text?.htmlDescription).toBe('<h2>P</h2>\n<h1>T</h1>\n<h3>S</h3>');
  });

  it('handles missing text object', () => {
    const content = {};
    expect(migrateTextCardContent(content)).toEqual(content);
  });

  it('handles partial text object', () => {
    const content: Partial<TextCardContent> = {
      text: {
        pretitle: 'Only pretitle',
      },
    };
    const result = migrateTextCardContent(clone(content));
    expect(result.text?.htmlDescription).toBe('<h2>Only pretitle</h2>');
    expect(result.text?.pretitle).toBe('');
  });
});
