import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { BINARY_FILE_EXTENSIONS, SUBSCRIPTION_INTERVALS, TEMPLATE_IGNORED_ENTRIES, TEMPLATE_VALUES } from './constants';
import { getConfigKey, parseExtensionName, toPascalCase } from './naming';
import type { ExtensionAnswers, ExtensionFile, ExtensionTexts } from './types';

const MARKETPLACE_FILE = 'marketplace.json';
const VUE_FILE_EXTENSION = '.vue';

/**
 * Formats a price as a JSON float literal. The marketplace requires a decimal point (`0.0`, not `0`),
 * which `JSON.stringify` would drop.
 */
export function formatPrice(price: number): string {
  return Number.isInteger(price * 10) ? price.toFixed(1) : price.toFixed(2);
}

/** Reads every file of the template extension, skipping build output. Paths are relative and use `/`. */
export function readTemplateFiles(templateDir: string, relativeDir = ''): ExtensionFile[] {
  if (!existsSync(templateDir)) {
    throw new Error(`Extension template not found: ${templateDir}`);
  }

  const files: ExtensionFile[] = [];
  const entries = readdirSync(join(templateDir, relativeDir), { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  for (const entry of entries) {
    if (TEMPLATE_IGNORED_ENTRIES.has(entry.name)) {
      continue;
    }

    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...readTemplateFiles(templateDir, relativePath));
    } else {
      const buffer = readFileSync(join(templateDir, relativePath));
      files.push({ path: relativePath, content: isBinary(relativePath) ? buffer : buffer.toString('utf8') });
    }
  }

  return files;
}

const isBinary = (path: string): boolean => BINARY_FILE_EXTENSIONS.has(extname(path).toLowerCase());

/**
 * Maps every template-specific string (names, texts, and the name's derived forms such as the
 * PascalCase component name or the Nuxt config key) to its replacement for the new extension.
 */
function buildReplacements(target: ExtensionTexts): Map<string, string> {
  const source = TEMPLATE_VALUES;
  const sourceSlug = parseExtensionName(source.name).slug;
  const targetSlug = parseExtensionName(target.name).slug;

  return new Map([
    [source.name, target.name],
    [source.displayNameEn, target.displayNameEn],
    [source.displayNameDe, target.displayNameDe],
    [source.descriptionEn, target.descriptionEn],
    [source.descriptionDe, target.descriptionDe],
    [source.supportEmail, target.supportEmail],
    [getConfigKey(source.name), getConfigKey(target.name)],
    [toPascalCase(sourceSlug), toPascalCase(targetSlug)],
    [sourceSlug, targetSlug],
  ]);
}

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Replaces all keys in one pass (longest first), so a replacement value is never itself
 * replaced again, e.g. when a description happens to contain the template's slug.
 */
function replaceAll(text: string, replacements: Map<string, string>, escape: (value: string) => string): string {
  const pattern = new RegExp(
    [...replacements.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|'),
    'g',
  );

  return text.replace(pattern, (match) => escape(replacements.get(match) ?? match));
}

const escapeJson = (value: string): string => JSON.stringify(value).slice(1, -1);
const identity = (value: string): string => value;

/** Escapes inserted answers so they cannot break the syntax of the file type they end up in. */
function getEscaper(path: string): (value: string) => string {
  switch (extname(path)) {
    case '.json':
      return escapeJson;
    default:
      return identity;
  }
}

/** Applies the pricing answers to the template's marketplace.json, keeping its other fields. */
function applyPricing(json: string, answers: ExtensionAnswers): string {
  const marketplace = JSON.parse(json);
  marketplace.price = answers.pricing === 'paid' ? (answers.price ?? 0) : 0;

  if (answers.pricing === 'subscription') {
    marketplace.subscription = SUBSCRIPTION_INTERVALS.filter(
      (interval) => answers.subscriptionPrices?.[interval] !== undefined,
    ).map((interval) => ({ interval, price: answers.subscriptionPrices?.[interval] ?? 0 }));
  } else {
    delete marketplace.subscription;
  }

  return `${JSON.stringify(marketplace, null, 2).replace(
    /("price": )(\d+(?:\.\d+)?)/g,
    (_, key: string, price: string) => `${key}${formatPrice(Number(price))}`,
  )}\n`;
}

/**
 * Turns the template files into the files of the new extension: placeholders in paths and
 * contents are replaced with the answers, binary files (placeholder images) are kept as they are.
 * Pure function: nothing is written here, so it can be previewed (dry-run) and tested.
 */
export function adjustTemplateFiles(templateFiles: ExtensionFile[], answers: ExtensionAnswers): ExtensionFile[] {
  const replacements = buildReplacements(answers);

  return templateFiles.map(({ path, content }) => {
    const adjustedPath = replaceAll(path, replacements, identity);
    // Binary files and Vue files are never rewritten: Vue code is not generated, only renamed.
    if (typeof content !== 'string' || extname(path) === VUE_FILE_EXTENSION) {
      return { path: adjustedPath, content };
    }

    const adjusted = replaceAll(content, replacements, getEscaper(path));
    return { path: adjustedPath, content: path === MARKETPLACE_FILE ? applyPricing(adjusted, answers) : adjusted };
  });
}
