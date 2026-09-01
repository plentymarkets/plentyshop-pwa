/**
 * Block generator prompts configuration
 *
 * A block is a component with its form always on (`withForm` is forced by `BlockGenerator`, see
 * `block.ts`), so unlike `componentPrompts` there's no "Include Form.vue?" question — choosing the
 * "block" generator already means yes — and no `withView`/`withToolbar` (those are for admin
 * settings panels, not CMS blocks).
 */

import { validateComponentName, validateNotEmpty } from '../../utils/validation';
import { BLOCK_ACCESS_CONTROL_CHOICES } from './component-prompts';

export const blockPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the block name?',
    validate: validateComponentName,
  },
  {
    type: 'confirm',
    name: 'skipTests',
    message: 'Skip test files?',
    default: false,
    when: () => process.env.PLENTYSHOP_SKIP_TESTS === undefined,
  },
  {
    type: 'confirm',
    name: 'skipTypes',
    message: 'Skip types.ts?',
    default: false,
    when: () => process.env.PLENTYSHOP_SKIP_TYPES === undefined,
  },
  {
    type: 'confirm',
    name: 'complexForm',
    message: 'Use a complex multi-file form (forms/ + partials/) instead of a single Form.vue?',
    default: false,
    when: () => process.env.PLENTYSHOP_COMPLEX_FORM === undefined,
  },
  {
    type: 'input',
    name: 'category',
    message: 'Block category (used for CMS editor grouping, e.g. "tabs", "banners")?',
    validate: validateNotEmpty,
    when: () => process.env.PLENTYSHOP_CATEGORY === undefined,
  },
  {
    type: 'checkbox',
    name: 'accessControl',
    message: 'Where should this block be selectable? (space to toggle, at least one required)',
    choices: BLOCK_ACCESS_CONTROL_CHOICES,
    default: ['content'],
    validate: (input: unknown) =>
      Array.isArray(input) && input.length > 0
        ? true
        : 'Select at least one context — an empty selection makes the block permanently invisible.',
    when: () => process.env.PLENTYSHOP_ACCESS_CONTROL === undefined,
  },
];
