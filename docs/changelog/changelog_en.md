# Changelog plentyshopPWA

## v1.4.0 (2024-04-08) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0" target="_blank" rel="noopener">

### New

v1:

- added a previous button for the return form                                         --> by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/327
- added tags display on single items and category view                                --> by @N-Feist in https://github.com/plentymarkets/plentyshop-pwa/pull/334
- added Item attribute select as box component                                        --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/339
- added possiblity to mark a primary address                                          --> by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/341
- deliver image attribute                                                             -->  by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/347
- nuxt upgrade                                                                        --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/345
- added display for item availability                                                 --> AB#98866 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/349
- added a sitemap generation for static content                                       --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/359
- added display for bundle items on item, cart, checkout and order summary view       --> by @N-Feist in https://github.com/plentymarkets/plentyshop-pwa/pull/360
- improved wishlist call performance                                                  --> by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/361
- added availability on wishlist item                                                 --> AB#101092 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/367
- load 'config' repository variable in upload action                                  --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/373
- unified address in a single component                                               --> by @doproiescu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/390
- added modern image(AVIF)                                                            --> AB#101096 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/372
- added search by tags                                                                --> by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/350
- added a order return confirmation page                                              --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/324

v2:

- Added a ‘Previous’ button to the return form for easier navigation.
- Added tag displays to single items and category views.
- Added a box component for selecting item attributes, enhancing user interaction.
- Added the possibility to mark a primary address for improved address management.
- Added image attributes on item images.
- Performed an Nuxt upgrade.
- Added an item availability display to provide inventory status.
- Added a sitemap generation feature for static content.
- Added a display for bundle items in item, cart, checkout, and order summary.
- Added performance optimization for wishlist calls.
- Added a ‘config’ repository variable to the upload action.
- Added a unified address handling in a single component.
- Added support for the modern image format (AVIF).
- Added a search by tags.
- Added an order return confirmation page.


### Changed

v1:

- removed unnecessary nodes to reduce DOM size and minor styling changes              --> by @Tim-M-S in https://github.com/plentymarkets/plentyshop-pwa/pull/340
- changed legal pages filenames                                                       --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/337
- optimised i18n imports                                                              --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/332
- unified remove buttons                                                              --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/354
- changed return layout from popup to side and layout chnage                          --> by @luisaha in https://github.com/plentymarkets/plentyshop-pwa/pull/344
- changed tags design and positioning                                                 --> AB#98448 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/346
- removed ../c/.. as category url identifier                                          --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/357
- changed the address format order                                                    --> by @abocsan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/375
- changed order confirmation styling                                                  --> AB#101529 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/379
- use different image urls for diffrent window sizes                                  --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/394
- changed delete from wishlist button placing to top right                            --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/398
- changed upload action                                                               --> by @pfrincu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/388 / by @pfrincu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/387

v2:

- Removed unnecessary nodes to reduce DOM size and made minor styling changes.
- Changed filenames of legal pages.
- Optimized i18n imports.
- Unified the design of remove buttons.
- Changed the return layout from a popup to its own page.
- Updated tags design and positioning for improved visibility.
- Removed ‘…/c/…’ as category URL identifier for cleaner URLs.
- Modified the order of address format.
- Updated the styling of the order confirmation page.
- Implemented different image URLs for different window sizes.
- Moved the ‘delete from wishlist’ button to the top right.
- Updated the upload action.


### Fixed

v1:

- improved the wishlist image quality                                                 --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/326
- validation for return quantity and reason                                           --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/325
- update order quantity after making a return                                         --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/329
- fixed attribute select arrow styling                                                --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/333
- fixed price buttons filter styling                                                  --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/335
- adjusted the return form for mobile return orders                                   --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/330
- fixed the back to shopping button behaviour and name                                --> by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/336
- fixed bug for search autocomplete with e-mail                                       --> by @doproiescu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/328
- fixed the position of tags on category view                                         --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/338
- fixed paypal credit card tests                                                      --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/356
- unified the styling of input heights                                                --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/352
- unified order properties styling                                                    --> by @doproiescu-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/351
- fixed styling issues on Radiobuttons and some spacing on checkboxes and Coupons     --> AB#100695 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/363
- fixed new return page styling and wording                                           --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/365
- excluded some pages from sitemap normally                                           --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/364
- improve item bundle styling/wording and only hyperlink if variation still exists    --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/366
- fixed function on "product" button in navbar                                        --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/377
- fixed the canonical language path                                                   --> AB#101715 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/376
- fixed legal text format for mobile device                                           --> AB#101548 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/374
- fixed missing bundle item description after refresh                                 --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/383
- fixed the header color on mobile device                                             --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/385
- doesnt clear cart after failing order process anymore                               --> by @FabianGerke in https://github.com/plentymarkets/plentyshop-pwa/pull/370
- fixed homepage layout shifts and deliver fixed image sizes                          --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/378
- fixed missing translations on homepage                                              --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/391
- fixed hardload after language switch leads to a ERROR 404                           --> AB#101714 by @csandru-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/386
- fixed missing wishlist navigation button on mobile device                           --> by @rbedeoan-plenty in https://github.com/plentymarkets/plentyshop-pwa/pull/396
- fixed nuxt component import paths for tests                                         --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/399
- fixed component import paths for notification test                                  --> by @maxiroellplenty in https://github.com/plentymarkets/plentyshop-pwa/pull/400
- fixed link to contribution guidelines in docs                                       --> by @ksted in https://github.com/plentymarkets/plentyshop-pwa/pull/342 (docs:)

v2:

- Improved the image quality on the wishlist.
- fixed validation for return quantity and reason.
- Updated the order quantity after making a return.
- Fixed the styling of the attribute select arrow.
- Fixed the styling of price buttons filter.
- Adjusted the return form for mobile return orders.
- Fixed the behavior and name of the ‘Back to Shopping’ button.
- Fixed a bug with search autocomplete where an email address will be filled in.
- Fixed the position of tags on the category view.
- Fixed the PayPal credit card tests.
- Unified the styling of input heights.
- Unified the styling of order properties.
- Fixed styling issues on radio buttons and adjusted spacing on checkboxes and coupons.
- Fixed the styling and wording on the new return page.
- Excluded certain pages from the sitemap normally.
- Improved the styling/wording of item bundles and validated hyperlinks, to only show, if the variation still exists.
- Fixed the function of the “Product” button in the navbar.
- Fixed the canonical language path.
- Fixed the format of legal text for mobile devices.
- Fixed the issue of missing bundle item description after refresh.
- Fixed the header color on mobile devices, to have a unified look and feel.
- Ensured the cart does not clear after a failed order process.
- Fixed homepage layout shifts and deliver fixed image sizes.
- Fixed missing translations on the homepage.
- Fixed the issue where a hard load after language switch leads to a 404 error.
- Fixed the missing wishlist navigation button on mobile devices.
- Fixed the import paths for Nuxt components in tests.
- Fixed the import paths for the notification test.
- Fixed the link to the contribution guidelines in the documentation.



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
