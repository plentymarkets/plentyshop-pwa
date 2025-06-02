import 'cypress-real-events';
import './commands';
import './failOnError';

beforeEach(() => {
  cy.setCookie('pwa', 'acd215e339caacefa5989992abd052ca');
});