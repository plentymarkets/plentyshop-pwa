/**
 * Extension generator prompts: the interactive wizard for scaffolding a marketplace extension.
 */

import { validateExtensionName } from '../../utils/validation';
import { MIN_PAID_PRICE, SUBSCRIPTION_INTERVALS } from './constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const required = (label: string) => (input: string) => (input.trim() ? true : `${label} is required`);

const validatePrice = (input: string): string | true => {
  const price = Number(input);
  if (Number.isNaN(price) || price < MIN_PAID_PRICE) {
    return `Price must be a number of at least ${MIN_PAID_PRICE.toFixed(1)}`;
  }
  return true;
};

/** Name of the prompt answer holding the price for one subscription interval. */
export const subscriptionPriceKey = (interval: string): string => `subscriptionPrice_${interval}`;

export const extensionPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'Package name of your extension (scoped, e.g. @my-company/four-seasons):',
    validate: (input: string) => validateExtensionName(input),
  },
  {
    type: 'input',
    name: 'displayNameEn',
    message: 'Marketplace name (English):',
    validate: required('Name'),
  },
  {
    type: 'input',
    name: 'displayNameDe',
    message: 'Marketplace name (German):',
    validate: required('Name'),
  },
  {
    type: 'input',
    name: 'descriptionEn',
    message: 'Short description (English):',
    validate: required('Description'),
  },
  {
    type: 'input',
    name: 'descriptionDe',
    message: 'Short description (German):',
    validate: required('Description'),
  },
  {
    type: 'input',
    name: 'supportEmail',
    message: 'Support email address:',
    validate: (input: string) => (EMAIL_PATTERN.test(input) ? true : 'Please enter a valid email address'),
  },
  {
    type: 'list',
    name: 'pricing',
    message: 'Pricing model:',
    choices: [
      { name: 'Free', value: 'free' },
      { name: `One-time purchase (min. ${MIN_PAID_PRICE.toFixed(1)})`, value: 'paid' },
      { name: 'Subscription', value: 'subscription' },
    ],
    default: 'free',
  },
  {
    type: 'input',
    name: 'price',
    message: 'Price in euros:',
    validate: validatePrice,
    filter: (input: string) => Number(input),
    when: (answers: Record<string, unknown>) => answers.pricing === 'paid',
  },
  {
    type: 'checkbox',
    name: 'subscriptionIntervals',
    message: 'Billing intervals to offer:',
    choices: SUBSCRIPTION_INTERVALS,
    validate: (input: unknown) => (Array.isArray(input) && input.length > 0 ? true : 'Select at least one interval'),
    when: (answers: Record<string, unknown>) => answers.pricing === 'subscription',
  },
  ...SUBSCRIPTION_INTERVALS.map((interval) => ({
    type: 'input',
    name: subscriptionPriceKey(interval),
    message: `Price per ${interval} interval in euros:`,
    validate: validatePrice,
    filter: (input: string) => Number(input),
    when: (answers: Record<string, unknown>) =>
      answers.pricing === 'subscription' &&
      Array.isArray(answers.subscriptionIntervals) &&
      answers.subscriptionIntervals.includes(interval),
  })),
  {
    type: 'checkbox',
    name: 'starters',
    message: 'Which starter files should be generated?',
    choices: [
      { name: 'Plugin (gated with defineExtensionPlugin)', value: 'plugin', checked: true },
      { name: 'Component (wrapped in ExtensionBoundary)', value: 'component', checked: true },
      { name: 'Composable (gated with isActive())', value: 'composable', checked: false },
      { name: 'Nuxt playground', value: 'playground', checked: true },
    ],
  },
];
