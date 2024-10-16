# Changelog plentyshopPWA

## v1.x.x (yyyy-mm-dd)

### New

- Added a new request header for configId and added no cache to environment variables.

### 🩹 Fixed

- Fixed an issue where product path was not reactive when category was changed.
- Automatically generate a language file for every active language, not just the default language.
- Soft login was still shown after successfully authenticating on the order confirmation page.
- Fixed an issue where manufacturer data was introducing 'name' into structured data instead of 'externalName'.

### 👷 Changed

- The `height` and `width` attributes that where set in terra ui are used only for full size images of an item.
- Generating missing language files based on the language configuration from the environment has been moved to the build script. The locale configuration is now based on the language files in the `lang` directory.
- Started to unify the SDK/API error handling. Errors do now return keys that can be translated in the frontend.

## v1.6.0 (2024-10-10) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.5.0...v1.6.0" target="_blank" rel="noopener"><b>Overview of all changes</b></a>

### TODO 📙 Migration guide

- Because Vue components now use different color weights (see **New** section for details), you have to update your color palettes as follows:
  - `900` -> `700`
  - `800` -> `600`
  - `700` -> `500`
  - `600` -> `400`
  - `500` -> `300`
  - `400` -> `200`
  - `300` -> `100`
  - `200` -> `50`
  - `100` -> `50`
- Replace all instances of `SfButton` with `UiButton`.
- Update the variable name `NEWSLETTER_FORM_SHOW_NAMES` to `NEWSLETTERFORMNAMES` in your environment.
- Update the variable name `USE_AVIF` to `IMAGEAVIF` in your environment.
- Update the variable name `USE_WEBP` to `IMAGEWEBP` in your environment.

### 🚀 New

#### Functionality

- A new page was added to the webshop for presenting offers. Users can accept or reject offers directly on this page, and upon acceptance, an order is automatically created.
- Product pages now display the EU responsible person of the manufacturer.
- The app now takes into consideration the referrer ID to display the correct price.
- Reorders now support order properties.
- Reorders now check for available stock.

#### Dev tools

- For debugging, you can now disable API caching with the query param `noCache=1`.

#### Payment

- PayPal's Pay Later banner is now displayed on product pages, the cart, checkout and quick checkout.
- Updated the PayPal form for credit card information.
- The quick checkout now displays variation properties.
- The order confirmation page now displays bank details if the payment method is cash in advance.

#### Configuration

- The app can now fetch the Favicon from the plentysystems system.
- The app can now fetch the logo from the plentysystems system.
- The app now reads which Google Fonts to use from the environment.
- The app can now generate a complete Tailwind color palette from a single main color. To use this functionality, enable the `build:before` hook's `generateScssVariables` method and set the environment variables `PRIMARY` and `SECONDARY`. These variables represent the center color of the Tailwind palette, weight `500`. As part of this update, all instances of `SfButton` have been replaced with a new `UiButton` component. Functionally, `UiButton` is identical to `SfButton`, but some color weights were adjusted to work with the generated palettes. ESLint now reports an `error` for `SfButton`. You can disable this rule in `apps/web/eslintrc.cjs`.
- The app now reads the internationalisation configuration from the environment. This includes the available languages and the default language.
- The app now reads whether to display the newsletter signup form on the homepage from the environment.
- The homepage template can now be configured via a category template.
- The footer and `shop-name` meta field now use the shop name.

#### SEO

- The app now reads the head title and title suffix from the environment.
- The app now reads metadata for products and categories, from the environment.
- The app now reads title and alternate for product images, from the environment.
- The app now reads metadata, such as description and keywords, from the environment.
- The app now reads the minimum required Open Graph data, that is the title, image, and endpoint, from the environment.
- Added canonical meta tags to product items.

#### Page speed

- Added cache-control for all static images to improve caching policy.
- Shop logo is now preloaded.

#### Accessibility Improvements

- Added table header in the MyAccount.
- Changed contrast for `Verfied purchase` text in feedback to increase accessibility.
- Added label tags for inputs in `NewsletterSubscribe.vue` component.
- Added labels for both min and max price filters.
- Increased size of wishlist and cart icon counter.
- Changed size for the cookie bar elements to increase accessibility.

### 🩹 Fixed

- Fixed `withDefaults() is unnecessary when using destructure with defineProps()` terminal error.
- Fixed the REST call to fetch the remote configuration in the build process.
- Fixed middleware calls being stuck in an infinite loop.
- Fixed tailwind css double import.
- Fixed a deadspot in the viewport for the navigation bar.
- Added link color on item variation properties.
- Fixed pagination issues with reactivity.
- Fixed wrongful display of base prices.
- Fixed setting the vsf-locale cookie on ssr.
- The side navigation of the automatically generated composables documentation now contains the correct links.
- Fixed editing author name on reviews and replies with added e2e.
- Fixed the issue with the plentyID-cookie in the PWA live preview.
- Fixed that the PayPal Express button on the product page is only displayed if the item is available for purchase.
- Fixed that when fetching configurations from plentysystems, the build would only apply updates on the second run.
- Fixed orphaned form label on product page attributes.
- Fixed cookie bar privacy link not working properly.
- Fixed minor styling issues in the credit card form in the checkout and the rating form on the product page.
- Fixed DE translation regarding VAT.
- Fixed wrong price issues.
- Base price display on minimum order quantity.
- Display fonts now use the configured font family.
- Incorrect display of the PayPal loader
- Fixed my orders actions paddings and cookie bar link sizes.
- Fixed basket accesibilty issues.
- Fixed broken aria reference in cournty select and login modal.
- Fixed addtobasket overlay accesibilty issues.
- Fixed login page accesibilty issues.

### 👷 Changed

- Addresses: Enhanced `Address` interaction with a new, streamlined design, improved UX, and a more intuitive structure.
- Addresses in read-only checkout are now displayed as non-editable and appear disabled.
- Unify html nodes on category page to use `h6` node.
- Added display of file properties with download links for items.
- Ensure the design of order properties and variation properties is consistent.
- Cookiebar icon has been replaced.
- Checkout address buttons in the mobile view have been adjusted.
- The configuration files for app, cookie, interntaionlisation, and Tailwind settings have been moved to the `apps/web/configuration` folder.
- Changes to item reviews logic in order to use the new feedback API.
- The order confirmation page url from `.../thank-you?[...]` to `.../confirmation/orderId/accessKey`.
- Remove cookie browser language detect.
- Set page `title` for items and categories instead of `meta-title`.
- Refactor of reviews functionality for better performance and maintainability.
- Change the file item property color to blue in the quick checkout.
- Changed the name of the Cloudflare Turnstile Sitekey environment variable to make it compatible with the system configuration.
- Eliminate the separate review average fetch by retrieving data directly from the reviews request.
- Resize demo favicon to 3 kb.
- The whole application uses the same font family now.
- Change the mobile design of the cookie bar layout.
- Modified manufacturer data appearance.

### 🏡 Chore

- Removed unnecessary Vue imports
- Updated Nuxt to 3.13.1 (includes Vue 3.5.0) for increased performance and stability.

## v1.5.0 (2024-07-19) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.4.1...v1.5.0" target="_blank" rel="noopener"><b>Overview of all changes</b></a>

### TODO 📙 Migration guide

- The package `@plentymarkets/shop-sdk` was migrated to the new `@vue-storefront/nuxt` middleware module structure.
- The package `@plentymarkets/shop-sdk` was removed and all its functionality was moved into `@plentymarkets/shop-api`
- All `@plentymarkets/shop-sdk` imports have to be renamed to `@plentymarkets/shop-api`
- useSdk() is now automatically imported and can no longer be imported. Remove all `import { useSdk } from '~/sdk';` imports.

[Full SDK migration changelog](https://github.com/plentymarkets/plentyshop-pwa/pull/452/files)

### 🚀 New

- Variation properties can be displayed in the store
- Demo for changing app settings at runtime
- Uploaded files as a product attribute can now be downloaded
- Hook to load system configuration
- Reorder previous purchases from 'My Account' and order confirmation pages using the 'Buy Again' feature.

### 🩹 Fixed

- Recursive calls found under catch-all `category/product` routes
- Multiple hydration errors
- A problem with the image loading status for products on category pages
- Webmanifest 404 error
- Checkout console error
- Product attributes empty list rendering
- Canonical links are now correctly set
- Missing translation in country select
- Missing item short description
- Wrong link on the order confirmation page
- Bundle items links missing image
- Badges elements rendering
- Wishlist button aria label
- Reserve place for PayPal in express checkout if paypal is not configured
- Item image size in item list
- Layout shift on "add to cart" button
- Wishlist button not toggling between filled/empty heart icon
- Addresses not being displayed in checkout after creation
- No redirect occurred when using the login on the header while on the guest login page
- Cross price display on small screen sizes
- Language selector on small screen sizes
- The scroll towards reviews on small screen sizes
- Fetch system configuration script not using the FETCH_REMOTE_CONFIG from .env
- Review overview design
- Guest wishlist functionality

### 👷 Changed

- Changed shortDescription to return empty string
- Improved display of reviews rating average
- Removed unnecessary hover state from cart items
- The mobile navigation bar at the bottom of the screen and the navigation/settings buttons in the checkout have been removed
- Added placeholder text for missing addresses
- Removed custom header in the myAccount
- Added tooltip for item attributes image component
- The token in the release workflow now uses a supplier secret
- Registration without cloudflare turnstile configuration is now possible

### 🏡 Chore

- Upgraded Nuxt and package dependencies
- Moved Lighthouse Test into its own GitHub action
- Moved paypal credit card test into quarantine folder

## v1.4.1 (2024-06-05) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.4.0...v1.4.1" target="_blank" rel="noopener"><b>Overview of all changes</b></a>

### New

- Pagination for review items has been added.
- Custom SVG icons are now supported.
- Images outside the visible area are now lazy loaded.
- The login dialogue before checkout has been added.
- The Selection of saved addresses in the checkout has been added.
- Images in category and item views now have width and height attributes.
- Item pages can now display reviews.
- “Item added to shopping cart” dialogue has been added.

### Fixed

- Fixed recommended product text overflow.
- Fixed too many reviews error case.
- Language select not closing when clicking outside the modal
- The display of coupons in the order confirmation was not working properly. This has been fixed.
- Some issues related to the display of item reviews have been fixed.
- Missing details have been added to the order confirmation.
- Interacting with the wishlist was not working as intended. This has been fixed.
- A "defineExpose" compiler error has been fixed.
- A random "Nuxt instance unavailable" error has been fixed.
- Hydration and intlify warnings have been fixed.
- Slashes at the end of the API_URL are now removed.
- The quality of images in the category view has been improved.
- The facet filtering on category pages has been corrected.
- A random login error has been fixed.
- When adding an item to the shopping cart that is already in the shopping cart, the item's quantity is now increased.
- Components of item bundles without an item URL no longer lead to a 404 page.
- Components of item bundles without a name now display the placeholder "Product Information Missing" in place of the name
- Filters on the category view could lead to a server-side rendering error. This has been fixed.
- The login button is now acessible.
- The middleware now supporty IPv6 addresses.
- The PayPal express button on the product page now handles the click event correctly.
- Fixed a lighthouse error regarding the wishlist button size.
- The returns image has been removed.
- The cookie bar mobile view has been improved.
- The wishlist close button margins have been corrected.
- A cart loader layout shift issue has been fixed.
- An empty wishlist image has been removed.
- Images of the attributes in the item view are now displayed correctly.
- An error regarding external cookie script loading has been fixed.
- The missing translations in the cookie bar have been added.

### Changed

- Demo images on the homepage have been converted to AVIF format.
- The styling of notifications has been adjusted.
- The customer registration form has been improved.
- Reviews in category and item views are now accessible.
- Demo images now have different sizes, based on the user's viewport.
- The design of the sitemap has been adjusted.
- Mark optional and required form fields.
- Structure of the useProduct composable
- Value proposition elements have been updated to receive indication if the image should be on the left or right.
- Value proposition allows now for multiple entries.

## v1.4.0 (2024-04-15) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0" target="_blank" rel="noopener">

### Migration guide

- The upload action was changed [.github/workflows/upload.yml](https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0#diff-8cf0b5fae548aab9bd49f5020da9c0e35d281984b82b8a5358ffb1c1ae5bec13L5) update the file to make use of the [config feature](https://pwa-docs.plentymarkets.com/guide/setup/deployment#config)
- We now require an API Security Token to make requests to the plentysystems API. [setup guide](https://pwa-docs.plentymarkets.com/guide/how-to/middleware#api-security-token)
- Category routing has been updated, and the /c prefix has been removed. Please verify that no static URLs in your application still include /c.
  - To accommodate the /c routing change, the [category page](https://github.com/plentymarkets/plentyshop-pwa/compare/v1.3.0...v1.4.0#diff-2f61484eb978aa090fc50dcba90bc44813b45081f25dbff295434cdf6bf219a4) was moved from apps/web/pages/category/[slug].vue to apps/web/pages/[...slug].vue.

### New

- Added scroll to top for review pagination.
- a ‘Previous’ button to the return form for easier navigation.
- Added tag display on single item and category views.
- a box component for selecting item attributes, enhancing user interaction
- an image component for selecting item attributes, enhancing user interaction
- possibility to mark a primary address for improved address management
- item availability display to provide inventory status.
- sitemap generation feature for static content.
- display for bundle items in item, cart, checkout, and order summary
- performance optimisation for wishlist calls.
- ‘config’ repository variable to the upload action.
- unified address handling in a single component.
- support for the modern image format (AVIF).
- search by tags.
- order return confirmation page.

### Changed

- Removed unnecessary HTML nodes to reduce DOM size.
- Changed filenames of legal pages.
- Optimized i18n imports.
- Performed an Nuxt upgrade to version 3.11.1.
- Unified the design of 'Remove' buttons.
- Changed the return layout from a popup to its own page.
- Removed ‘…/c/…’ as category URL identifier for cleaner URLs.
- Modified the order of address format.
- Updated the styling of the order confirmation page.
- Implemented different imagesize URLs for different viewport sizes.
- Moved the ‘delete from wishlist’ button to the top right.
- Updated the upload action.

### Fixed

- Improved the image quality on the wishlist.
- added validation for return quantity and reason during return creation.
- Updated the order quantity after making a return.
- Fixed the styling of the attribute select arrow.
- Fixed the styling of price buttons filter.
- Adjusted the return form for mobile return orders.
- Fixed the behavior and name of the ‘Back to Shopping’ button.
- Fixed a bug where an email address was added to the searchbar via autocomplete.
- Unified the styling of input heights.
- Unified the styling of order properties.
- Fixed styling issues on radio buttons and adjusted spacing on checkboxes and coupons.
- Fixed the styling and wording on the new return page.
- Excluded certain pages from the sitemap.
- Fixed the function of the 'Product' button in the navbar for mobile device.
- Canonical URL includes currently selected language path.
- Fixed the format of legal text on small display sizes.
- Fixed the header color on mobile devices, to have a unified look and feel.
- Ensured the cart does not clear after a failed order process.
- Fixed homepage layout shifts and deliver fixed image sizes.
- Added missing translations on the homepage.
- Fixed the issue where a hard load after language switch leads to a 404 error.
- Added the missing wishlist navigation button on mobile devices.
- Fixed the link to the contribution guidelines in the documentation.

## New Contributors

- @N-Feist made their first contribution in https://github.com/plentymarkets/plentyshop-pwa/pull/334
- @dependabot made their first contribution in https://github.com/plentymarkets/plentyshop-pwa/pull/389

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

- Removed demo how-to-buy section from footer.
- Fixed Order properties responsiveness bug
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
- New checkout layout - same address checkbox functionality

### Fixed

- After login the user was wrongfully forwared to the homepage. The user now stays on the current page.
- Added reviews and AggregateRating to seo structured data
- Filtering: No longer available filters are removed from the URL

## v1.0.0 (28.09.2023) First release
