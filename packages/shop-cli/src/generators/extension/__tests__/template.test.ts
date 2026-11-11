import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { EXTENSIONS_DIR, TEMPLATE_VALUES } from '../constants';
import { getConfigKey, getExtensionDirName, parseExtensionName, toPascalCase } from '../naming';
import { adjustTemplateFiles, formatPrice, readTemplateFiles } from '../template';
import type { ExtensionAnswers } from '../types';

const REPO_ROOT = resolve(__dirname, '../../../../../..');
const TEMPLATE_DIR = join(REPO_ROOT, EXTENSIONS_DIR, getExtensionDirName(TEMPLATE_VALUES.name));

const baseAnswers: ExtensionAnswers = {
  name: '@acme/four-seasons',
  displayNameEn: 'Four Seasons',
  displayNameDe: 'Vier Jahreszeiten',
  descriptionEn: 'Seasonal overlay.',
  descriptionDe: 'Saisonale Überlagerung.',
  supportEmail: 'support@acme.com',
  pricing: 'free',
};

const templateFiles = readTemplateFiles(TEMPLATE_DIR);
const generate = (answers: ExtensionAnswers = baseAnswers) => adjustTemplateFiles(templateFiles, answers);
const getFile = (answers: ExtensionAnswers, path: string) => generate(answers).find((file) => file.path === path);
const getText = (answers: ExtensionAnswers, path: string) => String(getFile(answers, path)?.content);

describe('hello-world template', () => {
  it('should still contain every value the generator replaces', () => {
    const allText = templateFiles
      .filter((file) => typeof file.content === 'string')
      .map((file) => `${file.path}\n${file.content}`)
      .join('\n');
    const { slug } = parseExtensionName(TEMPLATE_VALUES.name);
    const tokens = [...Object.values(TEMPLATE_VALUES), getConfigKey(TEMPLATE_VALUES.name), toPascalCase(slug), slug];

    for (const token of tokens) {
      expect(allText, `template no longer contains "${token}"`).toContain(token);
    }
  });

  it('should contain all files required by the marketplace validation', () => {
    const paths = templateFiles.map((file) => file.path);

    for (const lang of ['en', 'de']) {
      for (const doc of ['changelog', 'support_contact', 'user_guide']) {
        expect(paths).toContain(`meta/documents/${doc}_${lang}.md`);
      }
    }
    for (const icon of ['author', 'plugin']) {
      for (const size of ['xs', 'sm', 'md']) {
        expect(paths).toContain(`meta/images/icon_${icon}_${size}.png`);
      }
    }
    expect(paths).toContain('meta/images/preview_0.png');
    expect(paths).toContain('marketplace.json');
  });

  it('should have placeholder images at the required sizes', () => {
    const readSize = (path: string) => {
      const png = templateFiles.find((file) => file.path === path)?.content as Buffer;
      return [png.readUInt32BE(16), png.readUInt32BE(20)];
    };

    expect(readSize('meta/images/icon_author_xs.png')).toEqual([32, 32]);
    expect(readSize('meta/images/icon_author_sm.png')).toEqual([256, 256]);
    expect(readSize('meta/images/icon_plugin_md.png')).toEqual([512, 512]);
    expect(readSize('meta/images/preview_0.png')).toEqual([1280, 720]);
  });
});

describe('adjustTemplateFiles', () => {
  it('should use the same name in package.json, extension.config.ts and module meta', () => {
    const pkg = JSON.parse(getText(baseAnswers, 'package.json'));

    expect(pkg.name).toBe('@acme/four-seasons');
    expect(getText(baseAnswers, 'src/runtime/extension.config.ts')).toContain("name: '@acme/four-seasons'");
    expect(getText(baseAnswers, 'src/module.mts')).toContain("name: '@acme/four-seasons'");
    expect(getText(baseAnswers, 'src/module.mts')).toContain("configKey: 'acmeFourSeasons'");
  });

  it('should leave no template-specific value in any generated file', () => {
    const { slug } = parseExtensionName(TEMPLATE_VALUES.name);
    const leftovers = [slug, toPascalCase(slug), ...Object.values(TEMPLATE_VALUES)];

    for (const file of generate()) {
      if (typeof file.content !== 'string') {
        continue;
      }
      for (const leftover of leftovers) {
        expect(file.path, `path of ${file.path}`).not.toContain(leftover);
        expect(file.content, `${file.path} still contains "${leftover}"`).not.toContain(leftover);
      }
    }
  });

  it('should rename files that are named after the extension', () => {
    const paths = generate().map((file) => file.path);

    expect(paths).toContain('src/runtime/plugins/four-seasons.plugin.ts');
    expect(paths).toContain('src/runtime/components/FourSeasons.vue');
    expect(paths).toContain('src/runtime/composables/useFourSeasons.ts');
    expect(getText(baseAnswers, 'src/module.mts')).toContain('./runtime/plugins/four-seasons.plugin');
    expect(JSON.parse(getText(baseAnswers, 'playground/package.json')).name).toBe('module-four-seasons-playground');
  });

  it('should keep the gating of the starter files', () => {
    expect(getText(baseAnswers, 'src/runtime/plugins/four-seasons.plugin.ts')).toContain(
      'defineExtensionPlugin(extensionConfig.name',
    );
    expect(getText(baseAnswers, 'src/runtime/components/FourSeasons.vue')).toContain('<ExtensionBoundary');
    expect(getText(baseAnswers, 'src/runtime/composables/useFourSeasons.ts')).toContain('extensionConfig.isActive()');
  });

  it('should write the answers into marketplace.json, package.json and the documents', () => {
    const marketplace = JSON.parse(getText(baseAnswers, 'marketplace.json'));

    expect(marketplace.marketplaceName).toEqual({ en: 'Four Seasons', de: 'Vier Jahreszeiten' });
    expect(marketplace.shortDescription).toEqual({ en: 'Seasonal overlay.', de: 'Saisonale Überlagerung.' });
    expect(marketplace.categories).toEqual(['4408']);
    expect(JSON.parse(getText(baseAnswers, 'package.json')).description).toBe('Seasonal overlay.');
    expect(getText(baseAnswers, 'meta/documents/support_contact_en.md')).toContain('support@acme.com');
    expect(getText(baseAnswers, 'meta/documents/user_guide_de.md')).toContain('Vier Jahreszeiten');
  });

  it('should keep the files listed in package.json for publishing', () => {
    expect(JSON.parse(getText(baseAnswers, 'package.json')).files).toEqual(
      expect.arrayContaining(['dist', 'marketplace.json', 'meta']),
    );
  });

  it('should copy binary files unchanged', () => {
    const original = templateFiles.find((file) => file.path === 'meta/images/icon_author_xs.png');

    expect(getFile(baseAnswers, 'meta/images/icon_author_xs.png')?.content).toEqual(original?.content);
  });

  it('should escape answers so they cannot break JSON or Vue files', () => {
    const answers: ExtensionAnswers = {
      ...baseAnswers,
      displayNameEn: 'Snow "&" <Leaves>',
      descriptionEn: 'Says "hi"\\now',
    };

    expect(JSON.parse(getText(answers, 'marketplace.json')).marketplaceName.en).toBe('Snow "&" <Leaves>');
    expect(JSON.parse(getText(answers, 'package.json')).description).toBe('Says "hi"\\now');
    expect(getText(answers, 'src/runtime/components/FourSeasons.vue')).toContain('Snow "&amp;" &lt;Leaves&gt;');
  });

  it('should not replace values that were inserted from the answers', () => {
    const answers: ExtensionAnswers = { ...baseAnswers, descriptionEn: 'Like hello-world, but better.' };

    expect(JSON.parse(getText(answers, 'package.json')).description).toBe('Like hello-world, but better.');
  });

  describe('pricing', () => {
    it('should write a free extension with a float price', () => {
      expect(getText(baseAnswers, 'marketplace.json')).toContain('"price": 0.0');
      expect(JSON.parse(getText(baseAnswers, 'marketplace.json')).subscription).toBeUndefined();
    });

    it('should write a paid price and no subscription for one-time purchases', () => {
      const json = getText({ ...baseAnswers, pricing: 'paid', price: 19 }, 'marketplace.json');

      expect(json).toContain('"price": 19.0');
      expect(JSON.parse(json).subscription).toBeUndefined();
    });

    it('should write only the selected subscription intervals', () => {
      const answers: ExtensionAnswers = {
        ...baseAnswers,
        pricing: 'subscription',
        subscriptionPrices: { yearly: 120, monthly: 10 },
      };
      const json = getText(answers, 'marketplace.json');

      expect(JSON.parse(json).price).toBe(0);
      expect(JSON.parse(json).subscription).toEqual([
        { interval: 'monthly', price: 10 },
        { interval: 'yearly', price: 120 },
      ]);
      expect(json).toContain('"price": 10.0');
      expect(json).toContain('"price": 120.0');
    });
  });
});

describe('readTemplateFiles', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  const createTemplate = (files: Record<string, string>) => {
    const dir = mkdtempSync(join(tmpdir(), 'extension-template-'));
    tempDirs.push(dir);
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(join(dir, path, '..'), { recursive: true });
      writeFileSync(join(dir, path), content);
    }
    return dir;
  };

  it('should skip build output and caches', () => {
    const dir = createTemplate({
      'package.json': '{}',
      'src/module.mts': '',
      'dist/module.mjs': '',
      'node_modules/dep/index.js': '',
      'playground/.nuxt/nuxt.d.ts': '',
    });

    expect(readTemplateFiles(dir).map((file) => file.path)).toEqual(['package.json', 'src/module.mts']);
  });

  it('should throw when the template does not exist', () => {
    expect(() => readTemplateFiles(join(tmpdir(), 'does-not-exist-extension-template'))).toThrow(
      'Extension template not found',
    );
  });
});

describe('getExtensionDirName', () => {
  it('should prefix the slug with module-', () => {
    expect(getExtensionDirName('@acme/four-seasons')).toBe('module-four-seasons');
  });
});

describe('formatPrice', () => {
  it('should always include a decimal point', () => {
    expect(formatPrice(0)).toBe('0.0');
    expect(formatPrice(10)).toBe('10.0');
    expect(formatPrice(99.5)).toBe('99.5');
    expect(formatPrice(9.99)).toBe('9.99');
  });
});
