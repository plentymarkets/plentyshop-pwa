/**
 * Renders the actual block-related .hbs templates through the real Handlebars pipeline (same
 * helpers/partials plopfile.ts registers), the way plop itself does, to catch template bugs unit
 * tests on generator wiring alone would miss — e.g. a helper that's a no-op, or a raw-block that
 * silently renders empty.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import Handlebars from 'handlebars';
import type { NodePlopAPI } from 'plop';
import { registerDefaultHelpers } from '../../src/helpers';

const TEMPLATES_DIR = join(__dirname, '../../templates/component');
const PARTIALS_DIR = join(__dirname, '../../templates/partials');

const render = (templateFileName: string, data: Record<string, unknown>): string => {
  const raw = readFileSync(join(TEMPLATES_DIR, templateFileName), 'utf-8');
  return Handlebars.compile(raw)(data);
};

beforeAll(() => {
  const fakePlop = {
    setHelper: (name: string, fn: (...args: unknown[]) => unknown) => Handlebars.registerHelper(name, fn),
  } as unknown as NodePlopAPI;
  registerDefaultHelpers(fakePlop);

  for (const file of readdirSync(PARTIALS_DIR).filter((f) => f.endsWith('.hbs'))) {
    Handlebars.registerPartial(basename(file, '.hbs'), readFileSync(join(PARTIALS_DIR, file), 'utf-8'));
  }
});

describe('component-form.vue.hbs', () => {
  const rendered = () => render('component-form.vue.hbs', { name: 'TestBlock' });

  it('should render real Vue interpolation, not an empty raw-block artifact', () => {
    expect(rendered()).toContain("{{ getEditorTranslation('example-setting-label') }}");
    expect(rendered()).not.toContain('<UiFormLabel></UiFormLabel>');
  });

  it('should render an <i18n> block with exactly en and de keys', () => {
    const match = rendered().match(/<i18n lang="json">([\s\S]*?)<\/i18n>/);
    expect(match).not.toBeNull();
    const i18n = JSON.parse(match![1]);
    expect(Object.keys(i18n).sort()).toEqual(['de', 'en']);
  });
});

describe('defaults.ts.hbs', () => {
  it('should render a non-empty accessControl array and the block image constant', () => {
    const rendered = render('defaults.ts.hbs', {
      name: 'TestBlock',
      category: 'cards',
      accessControl: ['content', 'product'],
    });

    expect(rendered).toContain("accessControl: ['content', 'product']");
    expect(rendered).toContain('BLOCK_IMAGE');
    expect(rendered).toContain("category: 'cards'");
  });
});

describe('icon.svg.hbs', () => {
  it('should render well-formed, non-empty SVG markup', () => {
    const rendered = render('icon.svg.hbs', {});

    expect(rendered.trim().startsWith('<svg')).toBe(true);
    expect(rendered).toContain('</svg>');
  });
});

describe('types.ts.hbs', () => {
  it('should render block-shaped Props/FormProps when withForm is true', () => {
    const rendered = render('types.ts.hbs', { name: 'TestBlock', withForm: true });

    expect(rendered).toContain('export type TestBlockProps');
    expect(rendered).toContain('export type TestBlockFormProps');
    expect(rendered).toContain('configuration?: TestBlockStructureConfiguration');
  });

  it('should render the generic Props interface when withForm is false', () => {
    const rendered = render('types.ts.hbs', { name: 'TestComponent', withForm: false });

    expect(rendered).toContain('export interface TestComponentProps');
    expect(rendered).not.toContain('FormProps');
  });
});
