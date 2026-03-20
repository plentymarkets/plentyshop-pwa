---
prev: false
next: false
---

# Usage Guide

This guide provides detailed usage examples and explanations for the Shop Core module composables. Shop Core is designed to help you manage cookie consent, shop events, and other core functionalities in your Nuxt app with ease and flexibility.

## useCookieBar

The `useCookieBar` composable manages the cookie consent bar, allowing you to display, update, and persist user cookie preferences. It provides a simple API to control the visibility of the consent bar and to handle user actions regarding cookies.

```ts
const { visible, setConsent, setAllCookiesState, initializeCookies } = useCookieBar();
```

- `visible`: Whether the cookie bar is visible. Use this to show or hide the consent bar in your UI.
- `setConsent()`: Save the current consent state. Call this after the user updates their cookie preferences.
- `setAllCookiesState(accepted: boolean)`: Accept or reject all cookies at once. Useful for "Accept All" or "Reject All" actions.
- `initializeCookies()`: Initialize cookies from config. Call this on app startup to sync the consent state with your configuration.

## useCookieConsent

The `useCookieConsent` composable provides a reactive way to manage consent for a specific cookie. This is useful when you need to check or update the consent status for individual cookies throughout your app.

```ts
const { consent } = useCookieConsent('cookieName');
```

- `consent`: Consent state for the cookie. Use this to reactively check or update consent for a specific cookie.

## usePlentyEvent

The `usePlentyEvent` composable offers an event bus for emitting and listening to custom shop events. This enables decoupled communication between different parts of your app, such as reacting to cart changes or user actions.

```ts
const { on, emit } = usePlentyEvent();

on('frontend:addToCart', (payload) => {
  /* Handle cart add event */
});

emit('frontend:addToCart', { productId: 123 });
```

- `on(event: string, handler: Function)`: Listen to a specific event and execute a handler when it occurs.
- `emit(event: string, payload?: any)`: Emit an event with an optional payload to notify listeners.

See [Event Bus](/guide/modules/shop-core/event-bus.md) for more details and a list of common events.
