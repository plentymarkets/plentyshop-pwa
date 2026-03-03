/**
 * Component generator prompts configuration
 */

import { validateComponentName } from '../../utils/validation';

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
];
