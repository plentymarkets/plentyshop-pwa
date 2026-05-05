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

## Register cookie in cookiebar

The `useRegisterCookie` composable lets you add new entries to the cookie bar and provide information about the cookie itself.
For examples, this includes the link to the provider's privacy policy and the lifespan.

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

| Property        | Type       | Values                                                                                                                                                              | Description                                                                                                                                      |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`          | `string`   | Any string. Typically a translation key.                                                                                                                            | Unique display/name identifier for the cookie. Used to prevent duplicate registration within the target cookie group and to store consent state. |
| `Provider`      | `string`   | Any string. Typically a provider name or translation key.                                                                                                           | Provider of the cookie/service, for example Google Analytics.                                                                                    |
| `Status`        | `string`   | Any string. Typically a status label or translation key.                                                                                                            | Status text shown for the cookie, for example whether it is active/inactive or required.                                                         |
| `PrivacyPolicy` | `string`   | Any string URL or path.                                                                                                                                             | Link to the privacy policy for the cookie provider/service.                                                                                      |
| `Lifespan`      | `string`   | Any string. Common examples are `Session`, `10 days`, `365 days`. For accepted cookies, numeric day-based values are used to calculate the consent-cookie lifetime. | Human-readable lifetime of the cookie.                                                                                                           |
| `accepted`      | `boolean`  | `true` or `false`. Defaults to `false` when consent is written if unset. Essential cookies may be forced to `true` by the cookie bar.                               | Initial consent state for this cookie.                                                                                                           |
| `script`        | `string[]` | Array of script URLs/paths. Only entries starting with `http` are injected as external scripts.                                                                     | Scripts to load when the cookie is accepted.                                                                                                     |
| `cookieNames`   | `string[]` | Array of cookie-name patterns. Values are passed to `new RegExp(cookieName)`, so plain names like `_ga` and regex-style patterns like `/^_ga/` may be used.         | Browser cookie names/patterns to remove when consent is revoked.                                                                                 |

## React to user consent

To read and react to the state of the a specific cookie you can use the `useCookieConsent` composable.

This composable uses the cookie name that you defined via `useRegisterCookie` to get the reactive state of the cookie.

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
