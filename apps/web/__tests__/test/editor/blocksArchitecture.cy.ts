import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { BlocksArchitectureObject } from '../../support/pageObjects/BlocksArchitectureObject';
import { LanguageSelectObject } from '../../support/pageObjects/LanguageSelectObject';
import { CategoryObject } from '../../support/pageObjects/CategoryObject';
import { ProductDetailPageObject } from '../../support/pageObjects/ProductDetailPageObject';

const cookieBar = new CookieBarObject();
const blocks = new BlocksArchitectureObject();
const languageSelect = new LanguageSelectObject();
const category = new CategoryObject();
const product = new ProductDetailPageObject();

describe('Blocks Architecture', () => {
  describe('initial load without data', () => {
    it('index page loads default template when no blocks in DB', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertDefaultHomepageTemplate()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('category page loads default template when no blocks in DB', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertDefaultCategoryTemplate()
        .assertFooterVisible();
    });

    it('product page loads default template when no blocks in DB', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      product.navigateFromCategory();

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertDefaultProductTemplate()
        .assertFooterVisible();
    });
  });

  describe('initial load with partial data', () => {
    it('index page loads main blocks and falls back to default footer', () => {
      blocks.interceptPartial();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('category page loads main blocks and falls back to default footer', () => {
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      blocks.interceptPartial();
      category.navigateFromHome();
      blocks.waitForBlocks();

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('product page loads main blocks and falls back to default footer', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      blocks.interceptPartial();
      product.navigateFromCategory(false);

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });
  });

  describe('initial load with partial data on cart', () => {
    it('cart page loads fallback footer when no footer blocks in DB', () => {
      blocks.interceptPartial();
      cy.visitAndHydrate(paths.cart);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertFooterVisible()
        .assertFooterHasDefaultColors();

      blocks.footerElement.should('not.contain.text', 'API Legal Column');
      blocks.footerElement.should('not.contain.text', 'API Column 3');
      blocks.footerElement.should('not.contain.text', 'API Column 4');
      blocks.footerElement.should('not.contain.text', '© API Store 2026');
    });
  });
  describe('initial load with full data on cart', () => {
    it('cart page loads footer from response', () => {
      blocks.interceptFull();
      cy.visitAndHydrate(paths.cart);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertFooterVisible()
        .assertFooterHasApiColors()
        .assertFooterContainsText('API Legal Column')
        .assertFooterContainsText('API Column 3')
        .assertFooterContainsText('API Column 4')
        .assertFooterContainsText('© API Store 2026');
    });
  });

  describe('initial load with full data', () => {
    it('index page loads main blocks and footer from response', () => {
      blocks.interceptFull();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasApiColors();
    });

    it('category page loads main blocks and footer from response', () => {
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      blocks.interceptFull();
      category.navigateFromHome();
      blocks.waitForBlocks();

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasApiColors();
    });

    it('product page loads main blocks and footer from response', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      blocks.interceptFull();
      product.navigateFromCategory(false);

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasApiColors();
    });
  });

  describe('locale switch without data', () => {
    it('index page loads default template after locale switch', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertDefaultHomepageTemplate()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('category page loads default template after locale switch', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertDefaultCategoryTemplate()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('product page loads default template after locale switch', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      product.navigateFromCategory();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertDefaultProductTemplate()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });
  });

  describe('locale switch without data on cart', () => {
    it('cart page loads fallback footer after locale switch', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.cart);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertFooterVisible()
        .assertFooterHasDefaultColors();

      blocks.footerElement.should('not.contain.text', 'API Legal Column');
      blocks.footerElement.should('not.contain.text', 'API Column 3');
      blocks.footerElement.should('not.contain.text', 'API Column 4');
      blocks.footerElement.should('not.contain.text', '© API Store 2026');
    });
  });

  describe('locale switch with partial data', () => {
    it('index page loads main blocks and falls back to default footer after locale switch', () => {
      blocks.interceptPartial();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('category page loads main blocks and falls back to default footer after locale switch', () => {
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      blocks.interceptPartial();
      category.navigateFromHome();
      blocks.waitForBlocks();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });

    it('product page loads main blocks and falls back to default footer after locale switch', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      blocks.interceptPartial();
      product.navigateFromCategory(false);
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasDefaultColors();
    });
  });

  describe('locale switch with partial data on cart', () => {
    it('cart page loads fallback footer after locale switch', () => {
      blocks.interceptPartial();
      cy.visitAndHydrate(paths.cart);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertFooterVisible()
        .assertFooterHasDefaultColors();

      blocks.footerElement.should('not.contain.text', 'API Legal Column');
      blocks.footerElement.should('not.contain.text', 'API Column 3');
      blocks.footerElement.should('not.contain.text', 'API Column 4');
      blocks.footerElement.should('not.contain.text', '© API Store 2026');
    });
  });

  describe('locale switch with full data', () => {
    it('index page loads main blocks and footer from response after locale switch', () => {
      blocks.interceptFull();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasApiColors()
        .assertFooterContainsText('API Legal Column')
        .assertFooterContainsText('© API Store 2026');
    });

    it('category page loads main blocks and footer from response after locale switch', () => {
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      blocks.interceptFull();
      category.navigateFromHome();
      blocks.waitForBlocks();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasApiColors()
        .assertFooterContainsText('API Legal Column')
        .assertFooterContainsText('© API Store 2026');
    });

    it('product page loads main blocks and footer from response after locale switch', () => {
      blocks.interceptEmpty();
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();
      category.navigateFromHome();
      blocks.interceptFull();
      product.navigateFromCategory(false);
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertHeaderContainerVisible()
        .assertApiTextBlockVisible()
        .assertFooterVisible()
        .assertFooterHasApiColors()
        .assertFooterContainsText('API Legal Column')
        .assertFooterContainsText('© API Store 2026');
    });
  });

  describe('locale switch with full data on cart', () => {
    it('cart page loads footer from response after locale switch', () => {
      blocks.interceptFull();
      cy.visitAndHydrate(paths.cart);
      cookieBar.acceptAll();
      languageSelect.switchLocale('de');

      // prettier-ignore
      blocks
        .assertFooterVisible()
        .assertFooterHasApiColors()
        .assertFooterContainsText('API Legal Column')
        .assertFooterContainsText('API Column 3')
        .assertFooterContainsText('API Column 4')
        .assertFooterContainsText('© API Store 2026');
    });
  });

  describe('path switching', () => {
    it('footer stays the same when navigating from index to category', () => {
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();

      blocks.assertFooterVisible();
      category.navigateFromHome();
      blocks.assertFooterVisible();
    });

    it('header stays the same when navigating from index to category', () => {
      cy.visitAndHydrate(paths.home);
      cookieBar.acceptAll();

      blocks.assertHeaderContainerVisible();
      category.navigateFromHome();
      blocks.assertHeaderContainerVisible();
    });
  });
});
