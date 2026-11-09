import { describe, it, expect } from 'vitest';
import { buildExtensionFiles, formatPrice, getExtensionDirName } from '../extension-files';
import { createPlaceholderPng } from '../png';
import type { ExtensionAnswers } from '../types';

const baseAnswers: ExtensionAnswers = {
  name: '@acme/four-seasons',
  displayNameEn: 'Four Seasons',
  displayNameDe: 'Vier Jahreszeiten',
  descriptionEn: 'Seasonal overlay.',
  descriptionDe: 'Saisonale Überlagerung.',
  supportEmail: 'support@acme.com',
  pricing: 'free',
  starters: ['plugin', 'component', 'composable', 'playground'],
};

const getFile = (answers: ExtensionAnswers, path: string) =>
  buildExtensionFiles(answers).find((file) => file.path === path);

describe('buildExtensionFiles', () => {
  it('should use the same name in package.json, extension.config.ts and module meta', () => {
    const pkg = JSON.parse(String(getFile(baseAnswers, 'package.json')?.content));
    const config = String(getFile(baseAnswers, 'src/runtime/extension.config.ts')?.content);
    const module = String(getFile(baseAnswers, 'src/module.mts')?.content);

    expect(pkg.name).toBe('@acme/four-seasons');
    expect(config).toContain("name: '@acme/four-seasons'");
    expect(module).toContain("name: '@acme/four-seasons'");
  });

  it('should generate all files required by the marketplace validation', () => {
    const paths = buildExtensionFiles(baseAnswers).map((file) => file.path);

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

  it('should list marketplace.json and meta in package.json files', () => {
    const pkg = JSON.parse(String(getFile(baseAnswers, 'package.json')?.content));

    expect(pkg.files).toEqual(expect.arrayContaining(['dist', 'marketplace.json', 'meta']));
  });

  it('should write the support email into the English support contact', () => {
    expect(String(getFile(baseAnswers, 'meta/documents/support_contact_en.md')?.content)).toContain('support@acme.com');
  });

  it('should write a free extension with a float price and the marketplace category', () => {
    const json = String(getFile(baseAnswers, 'marketplace.json')?.content);

    expect(json).toContain('"price": 0.0');
    expect(JSON.parse(json).categories).toEqual(['4408']);
    expect(JSON.parse(json).marketplaceName).toEqual({ en: 'Four Seasons', de: 'Vier Jahreszeiten' });
  });

  it('should write a paid price and no subscription for one-time purchases', () => {
    const json = String(getFile({ ...baseAnswers, pricing: 'paid', price: 19 }, 'marketplace.json')?.content);

    expect(json).toContain('"price": 19.0');
    expect(JSON.parse(json).subscription).toBeUndefined();
  });

  it('should write only the selected subscription intervals', () => {
    const answers: ExtensionAnswers = {
      ...baseAnswers,
      pricing: 'subscription',
      subscriptionPrices: { yearly: 120, monthly: 10 },
    };
    const parsed = JSON.parse(String(getFile(answers, 'marketplace.json')?.content));

    expect(parsed.price).toBe(0);
    expect(parsed.subscription).toEqual([
      { interval: 'monthly', price: 10 },
      { interval: 'yearly', price: 120 },
    ]);
  });

  it('should only register and generate the selected starters', () => {
    const answers: ExtensionAnswers = { ...baseAnswers, starters: ['plugin'] };
    const paths = buildExtensionFiles(answers).map((file) => file.path);
    const module = String(getFile(answers, 'src/module.mts')?.content);

    expect(paths).toContain('src/runtime/plugins/four-seasons.plugin.ts');
    expect(paths.some((path) => path.startsWith('playground/'))).toBe(false);
    expect(paths.some((path) => path.includes('components/'))).toBe(false);
    expect(module).toContain('addPlugin');
    expect(module).not.toContain('addComponentsDir');
    expect(String(getFile(answers, 'package.json')?.content)).not.toContain('playground:dev');
  });

  it('should gate the generated starters', () => {
    expect(String(getFile(baseAnswers, 'src/runtime/plugins/four-seasons.plugin.ts')?.content)).toContain(
      'defineExtensionPlugin(extensionConfig.name',
    );
    expect(String(getFile(baseAnswers, 'src/runtime/components/FourSeasons.vue')?.content)).toContain(
      '<ExtensionBoundary',
    );
    expect(String(getFile(baseAnswers, 'src/runtime/composables/useFourSeasons.ts')?.content)).toContain(
      'extensionConfig.isActive()',
    );
  });

  it('should generate placeholder PNGs at the required sizes', () => {
    const readSize = (path: string) => {
      const png = getFile(baseAnswers, path)?.content as Buffer;
      return [png.readUInt32BE(16), png.readUInt32BE(20)];
    };

    expect(readSize('meta/images/icon_author_xs.png')).toEqual([32, 32]);
    expect(readSize('meta/images/icon_author_sm.png')).toEqual([256, 256]);
    expect(readSize('meta/images/icon_plugin_md.png')).toEqual([512, 512]);
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

describe('createPlaceholderPng', () => {
  it('should produce a PNG with the right signature and size', () => {
    const png = createPlaceholderPng(8, 4, [1, 2, 3]);

    expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    expect(png.readUInt32BE(16)).toBe(8);
    expect(png.readUInt32BE(20)).toBe(4);
  });
});
