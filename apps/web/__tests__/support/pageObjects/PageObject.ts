export class PageObject {
  protected cachedBannerUuids: Map<number, string> = new Map();

  waitFor(intercepts: string[]) {
    cy.wait(intercepts);
    return this;
  }

  delay(delay: number) {
    cy.wait(delay);
    return this;
  }

  /**
   * Clears the banner UUID cache
   * Should be called in beforeEach when banner structure change between tests
   */
  clearBannerCache() {
    this.cachedBannerUuids.clear();
    return this;
  }

  /**
   * Extracts UUID from a banner block test-id attribute
   * @param index Index of the banner to get
   * @returns Chainable UUID string
   */
  getBannerBlockUuid(index: number = 0): Cypress.Chainable<string> {
    const cached = this.cachedBannerUuids.get(index);
    if (cached) return cy.wrap(cached);

    return cy
      .get('[data-testid^="banner-image-"]')
      .eq(index)
      .then(($el) => {
        const testId = $el.attr('data-testid') || '';
        const uuid = testId.replace('banner-image-', '');
        this.cachedBannerUuids.set(index, uuid);
        return uuid;
      });
  }
}
