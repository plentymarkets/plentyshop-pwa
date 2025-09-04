import { defineConfig } from 'cypress';
import cypressFailFast from 'cypress-fail-fast/plugin';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  fixturesFolder: '__tests__/fixtures',
  viewportHeight: 1080,
  viewportWidth: 1920,
  pageLoadTimeout: 70000,
  defaultCommandTimeout: 20_000,
  screenshotOnRunFailure: true,
  screenshotsFolder: '__tests__/report/screenshots',
  video: false,
  chromeWebSecurity: false,
  env: {
    FAIL_FAST_STRATEGY: 'spec',
    DEFAULT_FEEDBACK_ITEMS_PER_PAGE: 10,
    POST_CODE_VALIDATION_COUNTRY: 'United Kingdom',
    E2E_TEST_PAYPAL_EMAIL: process.env.E2E_TEST_PAYPAL_EMAIL || '',
    E2E_TEST_PAYPAL_PASSWORD: process.env.E2E_TEST_PAYPAL_PASSWORD || '',
    CONFIG_ID: process.env.CONFIG_ID || '1',
  },
  e2e: {
    setupNodeEvents(on, config) {
      cypressFailFast(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: '__tests__/test/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '__tests__/support/e2e.ts',
    retries: {
      runMode: 2,
    },
  },
});
