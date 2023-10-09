import { HomePageObject } from '../../support/pageObjects/HomePageObject';
import { paths } from '../../../utils/paths';

const homePage = new HomePageObject();

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
});

describe('Smoke: Homepage', () => {

  it('[smoke] Check if Category button exists ', () => {
    homePage.checkHeaderCategory();
  });
});
