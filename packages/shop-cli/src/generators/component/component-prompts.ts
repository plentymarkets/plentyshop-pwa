/**
 * Component generator prompts configuration
 */

import { validateComponentName, validateNotEmpty } from '../../utils/validation';

/**
 * `withForm` may come from the prompt answers (interactive mode) or, when the `--with-form` flag
 * skipped the prompt entirely, from the env var `bin/plentyshop.js` set before plop started.
 */
const isWithForm = (answers: Record<string, unknown>): boolean =>
  Boolean(answers.withForm) || process.env.PLENTYSHOP_WITH_FORM === 'true';

export const BLOCK_ACCESS_CONTROL_CHOICES = ['content', 'productCategory', 'product'];

export const componentPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the component name?',
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
    name: 'withForm',
    message: 'Include Form.vue (for CMS editor)?',
    default: false,
    when: () => process.env.PLENTYSHOP_WITH_FORM === undefined,
  },
  {
    type: 'confirm',
    name: 'withView',
    message: 'Include View.vue (for settings panel)?',
    default: false,
    when: () => process.env.PLENTYSHOP_WITH_VIEW === undefined,
  },
  {
    type: 'confirm',
    name: 'withToolbar',
    message: 'Include ToolbarTrigger.vue?',
    default: false,
    when: () => process.env.PLENTYSHOP_WITH_TOOLBAR === undefined,
  },
  {
    type: 'confirm',
    name: 'structure',
    message: 'Is this a structure/container block that holds other blocks as children (like MultiGrid/Carousel)?',
    default: false,
    when: (answers: Record<string, unknown>) => isWithForm(answers) && process.env.PLENTYSHOP_STRUCTURE === undefined,
  },
  {
    type: 'confirm',
    name: 'complexForm',
    message: 'Use a complex multi-file form (forms/ + partials/) instead of a single Form.vue?',
    default: false,
    when: (answers: Record<string, unknown>) =>
      isWithForm(answers) && process.env.PLENTYSHOP_COMPLEX_FORM === undefined,
  },
  {
    type: 'input',
    name: 'category',
    message: 'Block category (used for CMS editor grouping, e.g. "tabs", "banners")?',
    validate: validateNotEmpty,
    when: (answers: Record<string, unknown>) => isWithForm(answers) && process.env.PLENTYSHOP_CATEGORY === undefined,
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
    when: (answers: Record<string, unknown>) =>
      isWithForm(answers) && process.env.PLENTYSHOP_ACCESS_CONTROL === undefined,
  },
];
