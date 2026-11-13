/**
 * Extension generator
 * Scaffolds a PlentyONE marketplace extension by copying the hello-world template
 * (`packages/module-hello-world`) and adjusting names, texts and pricing to the wizard answers.
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { NodePlopAPI } from 'plop';
import { BaseGenerator } from '../../core';
import type { GeneratorAction, GeneratorPrompt, PathResolver, PromptAnswers } from '../../core';
import { dryRunManager } from '../../utils/dry-run';
import { validateExtensionName } from '../../utils/validation';
import { EXTENSIONS_DIR, SUBSCRIPTION_INTERVALS, TEMPLATE_VALUES } from './constants';
import { extensionPrompts, subscriptionPriceKey } from './extension-prompts';
import { getExtensionDirName } from './naming';
import { adjustTemplateFiles, readTemplateFiles } from './template';
import type { ExtensionAnswers, SubscriptionInterval } from './types';

const WRITE_EXTENSION_ACTION = 'write-extension';

/** Converts raw wizard answers into the typed shape used by the file builder. */
export function toExtensionAnswers(data: PromptAnswers): ExtensionAnswers {
  const subscriptionPrices: Partial<Record<SubscriptionInterval, number>> = {};
  for (const interval of SUBSCRIPTION_INTERVALS) {
    const price = data[subscriptionPriceKey(interval)];
    if (typeof price === 'number') {
      subscriptionPrices[interval] = price;
    }
  }

  return {
    name: data.name,
    displayNameEn: String(data.displayNameEn),
    displayNameDe: String(data.displayNameDe),
    descriptionEn: String(data.descriptionEn),
    descriptionDe: String(data.descriptionDe),
    supportEmail: String(data.supportEmail),
    pricing: (data.pricing as ExtensionAnswers['pricing']) ?? 'free',
    price: typeof data.price === 'number' ? data.price : undefined,
    subscriptionPrices,
  };
}

class ExtensionGenerator extends BaseGenerator {
  readonly name = 'extension';
  readonly description = 'Generate a new marketplace extension package';

  getPrompts(): GeneratorPrompt[] {
    return extensionPrompts as unknown as GeneratorPrompt[];
  }

  createActions(): GeneratorAction[] {
    return [{ type: WRITE_EXTENSION_ACTION, path: '' }];
  }

  validateInput(data: PromptAnswers): string | true {
    const validation = validateExtensionName(data.name);
    if (validation !== true) {
      return validation;
    }

    const templateDir = this.getTemplateDir();
    if (!existsSync(templateDir)) {
      return `Extension template not found: ${templateDir}`;
    }

    const target = this.getTargetDir(data.name);
    if (existsSync(target)) {
      return `Directory already exists: ${target}`;
    }

    return true;
  }

  getTargetDir(name: string): string {
    return join(this.pathResolver.getProjectRoot(), EXTENSIONS_DIR, getExtensionDirName(name));
  }

  /** Directory of the hello-world extension that new extensions are copied from. */
  getTemplateDir(): string {
    return this.getTargetDir(TEMPLATE_VALUES.name);
  }

  /** Registers the custom action that writes (or, in dry-run mode, previews) all extension files. */
  override register(plop: NodePlopAPI): void {
    plop.setActionType(WRITE_EXTENSION_ACTION, (answers) => {
      const extension = toExtensionAnswers(answers as PromptAnswers);
      const targetDir = this.getTargetDir(extension.name);
      const files = adjustTemplateFiles(readTemplateFiles(this.getTemplateDir()), extension);

      for (const file of files) {
        const fullPath = join(targetDir, file.path);
        if (dryRunManager.isDryRun) {
          dryRunManager.logOperation('create', fullPath, file.content.toString());
        } else {
          mkdirSync(dirname(fullPath), { recursive: true });
          writeFileSync(fullPath, file.content);
        }
      }

      if (dryRunManager.isDryRun) {
        return dryRunManager.getSummary();
      }

      return `Created ${files.length} files in ${targetDir}\nNext: replace the placeholder images in meta/images and fill in meta/documents.`;
    });

    super.register(plop);
  }
}

export default function extensionGenerator(plop: NodePlopAPI, pathResolver: PathResolver): void {
  new ExtensionGenerator(pathResolver).register(plop);
}
