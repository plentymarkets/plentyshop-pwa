# Changelog plentyshopPWA

## v1.1.0 (XX.XX.2023) <a href="https://github.com/plentymarkets/plentyshop-pwa/compare/v1.0.0...v1.0.1" target="_blank" rel="noopener"><b>Overview of all changes</b></a>

### TODO

- [Middleware](./docs/config/middleware.md) `API_ENDPOINT` now has to be maintained via an `.env` file under `apps/server`.

### New

- Added PayPal Express Checkout
- Added PayPal payment option for credit cards
- PayPal: The "integration.config"-file is no longer required
- MyAccount: The creation and editing of shipping and billing addresses is now possilbe
- MyAccount: The order history shows the latest orders of the logged-in customer
- MyAccount: The return history shows the latest returns of the logged-in customer
- The order confirmation now shows all relevant data of the order
- The order confirmation now displays buttons to download order documents
- The order confirmation can now be accessed via a link after authentication
- The order confirmation is now also accessible via the order history
- None saleable items are marked as such
- Added display of bulk and graduated prices on item pages
- Added more default notifications for a variaty of interactions in the PWA
- Added loading animations where applicable
- Display of net/gross prices depending on the configuration
- Added menu to header to switch between different language versions of the PWA
- Multilingual URLs are now used for different language versions of the PWA
- Added composable that sets canonical url metadata for static pages.
- Added notification for deleting an item from the cart

### Changed

- Updated URL structure to be more similar to plentyShop LTS
- Reworked logic of items with multiple attributes
- Current bulk price is now marked on item pages
- Changed position of notifications
- For items with different prices, the cheapest price is displayed as "from price" on the category page

### Fixed

- After login the user was wrongfully forwared to the homepage. The user now stays on the current page.
- Added reviews and AggregateRating to seo structured data
- Filtering: No longer available filters are removed from the URL

## v1.0.0 (28.09.2023) First release
