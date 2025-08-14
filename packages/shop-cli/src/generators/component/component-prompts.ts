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
];
