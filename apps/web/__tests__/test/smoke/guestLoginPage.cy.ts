import { paths } from '../../../utils/paths';

describe('Smoke: Guest Login page', () => {
  it('[smoke] Should not contain hydration errors', () => {
    cy.checkConsoleWarningsDoNotContain('[Vue warn]: Hydration');
    cy.visitAndHydrate(paths.guestLogin);
  });
});
