# Changelog plentyshopPWA

## v1.4.0 (2024-04-08) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0" target="_blank" rel="noopener">

### New

- added a previous button for the return form
- added tags display on single items and category view
- added Item attribute select as box component
- added possiblity to mark a primary address
- deliver image attribute                                                             -->  by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/347
- nuxt upgrade                                                                        --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/345
- added display for item availability                                                 --> AB#98866 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/349
- added a sitemap generation for static content                                       --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/359
- added display for bundle items on item, cart, checkout and order summary view       --> by @N-Feist in https://github.com/plentymarkets/plentyshop-pwa/pull/360

* feat: improve wishlist calls by                                                     --> @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/361  -> ?????

- added availability on wishlist item                                                 --> AB#101092 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/367
- load 'config' repository variable in upload action                                  --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/373

* feat: remove artifact from the action                                               --> by @pfrincu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/388 -> ?????
* feat: create new action for new release to send repo zip to the s3 bucket           --> by @pfrincu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/387 -> ?????

- unified address in a single component                                               --> by @doproiescu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/390
- added modern image(AVIF)                                                            --> AB#101096 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/372
- added search by tags                                                                --> by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/350

### Change

- removed unnecessary nodes to reduce DOM size and minor styling changes
- changed legal pages filenames
- optimised i18n imports
- unified remove buttons                                                              --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/354
- changed return layout from popup to side and layout chnage                          --> by @luisaha in https://github.com/plentymarkets/plentyshop-pwa/pull/344
- changed tags design and positioning                                                 --> AB#98448 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/346
- removed ../c/.. as category url identifier                                          --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/357

### Fixed

* fix: wishlist image quality by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/326
* fix: validation for return quantity and reason by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/325
* fix: return thank you page by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/324
* fix: update return quantity by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/329
* fix: attribute select arrow by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/333
* fix: price buttons filter by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/335
* fix: mobile return orders by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/330
* fix: back to shopping behaviour by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/336
* fix: quick bug fix for search autocomplete by @doproiescu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/328
* fix: update position tags by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/338
* fix: paypal credit card test by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/356
* fix: unify styling of input heights by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/352
* fix: unify order properties styles by @doproiescu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/351
* fix: styling issues AB#100695 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/363
* fix: new return page style by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/365
* fix: sitemap excludes by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/364
* fix: improve item bundle by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/366
* fix: navbar product button by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/377
* fix: canonical language path AB#101715 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/376
* fix: address format by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/375
* fix: legal text mobile AB#101548 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/374
* fix: order confirmation styling AB#101529 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/379
* fix:  item bundle csss by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/380
* fix: display bundle on ssr by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/383
* fix: header color on mobile device by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/385
* fix: dont clear cart after failing order process by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/370
* fix: homepage cls by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/378
* fix: homepage missing translations by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/391
* fix: language switch AB#101714 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/386
* fix: different image urls for viewports by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/394
* fix: wishlist button by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/396
* fix: wishlist button top right by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/398
* fix: nuxt component import paths for tests by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/399
* fix: notification test component imports by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/400



_____________________________________________________________________________________________________________________________________________________________________
* docs: fix link to contribution guidelines by @ksted in https://github.com/plentymarkets/plentyshop-pwa/pull/342

* chore: update sdk version api response fixes by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/353

* chore: downgrade turbo package to a version that does not contain the… by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/368

* chore(deps): bump the npm_and_yarn group across 1 directory with 1 update by @dependabot in https://github.com/plentymarkets/plentyshop-pwa/pull/389
_____________________________________________________________________________________________________________________________________________________________________




## New Contributors
* @N-Feist made their first contribution in https://github.com/plentymarkets/plentyshop-pwa/pull/334
* @dependabot made their first contribution in https://github.com/plentymarkets/plentyshop-pwa/pull/389

**Full Changelog**: https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0

## v1.3.0 (2024-02-06) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.2.0...v1.3.0" target="_blank" rel="noopener">

### New

- Added order properties on product pages, in the cart, and on the order summary.
- Added coupons.
- Added PayPal's **Pay Later** option for payments.
- Added returns, including return reasons.
- Added wishlist functionality, including the ability to add products to the cart directly from the wishlist.
- Added product ratings to category pages.
- Added configuration (`cookie-scripts.config.ts`) to determine which scripts to load when a user accepts a consent cookie.
- Added Cloudflare Turnstile to protect forms against bots. For further information on how to configure Turnstile, refer [to the documentation](https://pwa-docs.plentymarkets.com/guide/how-to/bot-protection).
- Added form validation with vee-validate. The following forms have validation:
  - Registering a new account
  - Signing up for the newsletter
  - Add a product with order properties to the cart
  - Parts of the checkout; full coverage of the checkout will be added in the future
- Added a way to exit preview mode on live domains.

### Changed

- Deployments now use a unified endpoint. This means the secret `URL_ENDPOINT` is obsolete.

### Fixed

- Addresses in the checkout now update properly.
- The PayPal buttons now show the correct text depending on the location of the button.
- The mega menu no longer displays categories without a label.
- The cookie consent bar is now translated in English and German.
- The lifespan of the `vsf-locale` cookie has been fixed. The lifespan is now 100 days.
- Fixed Cumulative Layout Shifts caused by the language picker.
- Added missing aria labels to the category pagination.
- Added missing aria labels to the cookie bar.
- Improved the clickable area on the logo for better accessibility on mobile.
- When navigating back from the registration modal on mobile, the modal now closes and you no longer return to the previous URL.

## v1.2.0 (2023-11-28) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.1.0...v1.2.0" target="_blank" rel="noopener"><b>Overview of all changes</b></a>

### New

- Added getters to show variation properties.
- Added a frontend toggle to disable the pwa preview mode.
- Added structured data for ratings (reviews).
- Added item images on the order confirmation (thank you) page.
- Added protection against CSRF attacks.

### Changed

- Reworked logic of cookie bar.
- Added ARIA label translations for cookie bar buttons.
- The language select has been refactored and is now showing country flags.
- Refactored the checkout page to load less data.

### Fixed

- CancellationForm page not loading.
- Failing minimum buy price setting was not shown as error.
- Notifications were causing a layout shift for the user, this has been fixed.
- Categories loading in the wrong language when the site was rendered with SSR for the first time.
- The variation select didn't remove the variation from the URL when the base variation was selected.
- Products on the order confirmation didn't link to the correct product.

## v1.1.0 (2023-11-03) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.0.0...v1.1.0" target="_blank" rel="noopener"><b>Overview of all changes</b></a>

### TODO

- [Middleware](./docs/config/middleware.md) `API_ENDPOINT` now has to be maintained via an `.env` file under `apps/server`.

### New

- Added PayPal Express Checkout
- Added PayPal payment option for credit cards
- PayPal: The `integration.config` file is no longer required
- MyAccount: The creation and editing of shipping and billing addresses is now possible
- MyAccount: The order history shows the latest orders of the logged-in customer
- MyAccount: The return history shows the latest returns of the logged-in customer
- The order confirmation now shows all relevant data of the order
- The order confirmation now displays buttons to download order documents
- The order confirmation can now be accessed via a link after authentication
- The order confirmation is now also accessible via the order history
- None saleable products are marked as such
- Added display of bulk and graduated prices on product pages
- Display of net/gross prices depending on the configuration
- Added menu to header to switch between different language versions of the PWA
- Multilingual URLs are now used for different language versions of the PWA
- Added structured data for breadcrumbs, categories, products and logo
- Added composable that sets canonical url metadata for static pages.
- Added more default notifications for a variaty of interactions in the PWA
- Added loading animations where applicable

### Changed

- Reworked logic of products with multiple attributes
- Current bulk price is now marked on product pages
- For products with different prices, the cheapest price is displayed as "from price" on the category page
- Updated URL structure to be more similar to plentyShop LTS
- Changed position of notifications

### Fixed

- After login the user was wrongfully forwared to the homepage. The user now stays on the current page.
- Added reviews and AggregateRating to seo structured data
- Filtering: No longer available filters are removed from the URL

## v1.0.0 (28.09.2023) First release
