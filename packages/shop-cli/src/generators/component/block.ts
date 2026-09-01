/**
 * Block Generator for PlentyONE Shop
 *
 * A CMS block is a component with its form always on — this is `ComponentGenerator` registered
 * under its own name so it shows up as its own choice in `npx plentyshop generate`'s interactive
 * generator picker (previously only reachable via `component --with-form` / `npm run
 * generate:block`, never listed there directly). All actual file-generation logic
 * (`createActions()`, defaults.ts/icon.svg/complex-form wiring) is inherited unchanged.
 */

import type { NodePlopAPI } from 'plop';
import type { PromptAnswers, GeneratorPrompt, PathResolver } from '../../core';
import { ComponentGenerator } from './component';
import { blockPrompts } from './block-prompts';

class BlockGenerator extends ComponentGenerator {
  readonly name = 'block';
  readonly description = 'Generate a CMS block component (with Form.vue, defaults.ts, icon.svg)';

  getPrompts(): GeneratorPrompt[] {
    return blockPrompts as GeneratorPrompt[];
  }

  protected resolveOptions(data: PromptAnswers): ReturnType<ComponentGenerator['resolveOptions']> {
    return { ...super.resolveOptions(data), withForm: true };
  }
}

export default function blockGenerator(plop: NodePlopAPI, pathResolver: PathResolver): void {
  const generator = new BlockGenerator(pathResolver);
  generator.register(plop);
}
