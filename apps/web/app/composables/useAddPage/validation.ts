import { string } from 'yup';

export const pageNameSchema = string()
  .required('Enter a page name')
  .test('no-numbers-only', 'Page name cannot consist only of numbers', (value) => !/^\d+$/.test(value.trim() ?? ''))
  .default('');
