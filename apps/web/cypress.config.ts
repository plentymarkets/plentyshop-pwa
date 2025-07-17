import { defineConfig } from 'cypress';
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
    DEFAULT_FEEDBACK_ITEMS_PER_PAGE: 10,
    POST_CODE_VALIDATION_COUNTRY: 'United Kingdom',
    E2E_TEST_PAYPAL_EMAIL: process.env.E2E_TEST_PAYPAL_EMAIL || '',
    E2E_TEST_PAYPAL_PASSWORD: process.env.E2E_TEST_PAYPAL_PASSWORD || '',
  },
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    specPattern: '__tests__/test/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '__tests__/support/e2e.ts',
    retries: {
      runMode: 2,
    },
  },
});
