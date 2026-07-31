import { paths } from '../../../app/utils/paths';
import { CookieBarObject } from '../../support/pageObjects/CookieBarObject';
import { DeviceToggleObject } from '../../support/pageObjects/DeviceToggleObject';

const cookieBar = new CookieBarObject();
const deviceToggle = new DeviceToggleObject();

describe('Editor Device Toggle', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearConfig();
    cy.setConfig({ isPreview: true });
    cy.visitAndHydrate(paths.home);
    cookieBar.acceptAll();
  });

  it('shows all three device toggle buttons', () => {
    deviceToggle.mobileButton.should('be.visible');
    deviceToggle.tabletButton.should('be.visible');
    deviceToggle.desktopButton.should('be.visible');
  });

  it('starts with desktop as the active device', () => {
    deviceToggle.assertDesktopActive();
  });

  it('switches to mobile preview: active state + 375px container width', () => {
    deviceToggle.selectMobile().assertMobileActive().assertPreviewWidth(375);
  });

  it('switches to tablet preview: active state + 768px container width', () => {
    deviceToggle.selectTablet().assertTabletActive().assertPreviewWidth(768);
  });

  it('switches back to desktop: active state + full-width container (no inline width)', () => {
    deviceToggle.selectMobile().selectDesktop().assertDesktopActive().assertPreviewIsFullWidth();
  });

  it('navbar bottom is visible in mobile preview', () => {
    deviceToggle.selectMobile().assertNavbarBottomVisible();
  });

  it('toggling devices does not crash the page', () => {
    deviceToggle.selectMobile().selectTablet().selectDesktop().selectMobile();

    cy.getByTestId('editor-preview-container').should('exist');
  });
});
