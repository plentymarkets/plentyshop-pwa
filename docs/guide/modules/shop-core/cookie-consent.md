---
prev: false
next: false
---

# Cookie Consent System

The Shop Core module provides a flexible and robust cookie consent system for Nuxt applications. This system helps you comply with privacy regulations by allowing users to manage their cookie preferences easily. It supports grouping cookies by purpose, registering scripts, and handling consent changes dynamically.

## Features

- Dynamically add cookies
- Group cookies by purpose (e.g., analytics, marketing, essentials)
- Register cookies and scripts that depend on user consent
- Accept or reject all cookies, or manage them individually
- Automatically remove cookies and scripts when consent is revoked
- Seamless integration with your Nuxt app UI

## API

### useCookieBar

- `visible`: Controls the visibility of the cookie bar
- `setConsent()`: Save the current consent state
- `setAllCookiesState(accepted: boolean)`: Accept or reject all cookies
- `initializeCookies()`: Initialize consent state from configuration

### useRegisterCookie

Register a cookie in the cookiebar.

```ts
const { add } = useRegisterCookie();

add({
  name: 'CookieBar.moduleGoogleAnalytics.googleAnalytics',
  Provider: 'CookieBar.moduleGoogleAnalytics.provider',
  Status: 'CookieBar.moduleGoogleAnalytics.status',
  PrivacyPolicy: 'https://policies.google.com/privacy',
  Lifespan: 'Session',
  cookieNames: ['/^_ga/', '_ga', '_gid', '_gat'],
  accepted: false,
});
```

### useCookieConsent

To read and react to the state of the a specific cookie you can use the `useCookieConsent` composable.

This composable uses the cookie name that you defined in the `cookie.config.ts` or via `useRegisterCookie` to get the reactive state of the cookie.

```vue
// MyComponent.vue
<template>
  <ScriptDemoButton v-if="scriptDemoCookie"></ScriptDemoButton>
  <div v-else>
    <div>Script demo cookies not accepted</div>
  </div>
</template>

<script setup lang="ts">
const { consent: scriptDemoCookie } = useCookieConsent('CookieBar.moduleGoogleAnalytics.googleAnalytics');

watch(scriptDemoCookie, () => {
  reloadScript();
  console.log('ScriptDemo value', scriptDemoCookie.value);
  // do something when the cookie changes.
});
</script>
```

## Configuration

Configure cookie groups and their associated cookies in your Nuxt config. This allows you to define which cookies are essential, which require consent, and what scripts should be loaded based on user preferences.

For more advanced configuration and usage, see [Usage Guide](/guide/modules/shop-core/usage-guide.md).
