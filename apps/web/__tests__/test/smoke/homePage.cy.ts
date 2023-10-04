import { paths } from '../../../utils/paths';
import { HomePageObject } from '../../support/pageObjects/HomePageObject';

const homePage = new HomePageObject();

beforeEach(() => {
  cy.visitAndHydrate(paths.home);
});

describe('Smoke: Homepage', () => {

  it('[smoke] Check if Category button exists ', () => {
    homePage.checkHeaderCategory();
  });
});
