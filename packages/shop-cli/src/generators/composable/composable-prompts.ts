/**
 * Composable generator prompts configuration
 * Generates Vue composables with API integration patterns
 */

import { validateComposableName } from '../../utils/validation';

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
  {
    type: 'confirm',
    name: 'skipTests',
    message: 'Skip test files?',
    default: false,
    when: () => process.env.PLENTYSHOP_SKIP_TESTS === undefined,
  },
];
