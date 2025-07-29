/**
 * UI Component generator prompts configuration
 * Enforces Vue.js style guide patterns for base and single-instance components
 */

import { validateComponentName } from '../utils/validation.js';

export const uiComponentPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of your UI component? (e.g., Button, Input, Card)',
    validate: (input: string) => {
      const validation = validateComponentName(input);
      return validation === true ? true : validation;
    },
  },
];
