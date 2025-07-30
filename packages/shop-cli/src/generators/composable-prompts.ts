/**
 * Composable generator prompts configuration
 * Generates Vue composables with API integration patterns
 */

import { validateComposableName } from '../utils/validation.js';

export const composablePrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of your composable? (e.g., useCustomerOrder, useProductData, useAddressList)',
    validate: (input: string) => {
      const validation = validateComposableName(input);
      return validation === true ? true : validation;
    },
  },
];
