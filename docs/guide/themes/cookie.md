# Cookie consent

Data protection and privacy regulation in the EU [requires websites](https://europa.eu/youreurope/business/dealing-with-customers/data-protection/online-privacy/index_en.htm) to get user consent before collecting the user's data. This includes not just regular tracking services like Google Analytics. It may also apply to any user data you transmit to external service providers.

For you, this means that you need a way of asking for user consent and allow or block functionality depending on the user's choices.

## Cookie bar appearance

The cookie bar provides the user with information about consent options and a way to allow all cookies, allow a selection of cookies or deny all cookies that aren't essential to running the website. You can customise the appearance of the cookie bar in `Cookiebar.vue`.

:::warning
If you customise the cookie bar, make sure your new design is legally compliant.
:::

When the website loads for the first time in a session, the cookie bar is visible. The first time the user selects a setting, the site updates the consents without reloading. When the user changes the settings, the page reloads automatically to update the consents.

The browser saves consents in the browser cookies in the following format:

```
{
  "CookieGroup": {
    "Cookie-1": true,
    "Cookie-2": false
  }
}
```

## Cookie configuration

Edit `cookie.config.ts` to configure cookies and cookie groups. Refer to the interfaces `Cookie` and `CookieGroup` for all available properties.

You can add both external scripts, such as Google Tag Manager, and internal scripts that you implement yourself. In both cases, use the `script` property of a cookie in `cookie.config.ts`. Note that the same cookie can govern external and internal scripts at the same time.

::: info
To add cookies dynamically, check [our advanced guide](/guide/modules/shop-core/cookie-consent)
:::

### External scripts

In `cookie.config.ts`, add the `script` property to the cookie. The property accepts an array of strings. The strings describe the URLs of the scripts to load. The scripts are loaded when the user accepts the cookie.

```ts
// cookie.config.ts

cookies: [
  {
    name: 'CookieBar.functional.cookies.scriptDemo.name',
    Provider: 'CookieBar.functional.cookies.scriptDemo.provider',
    Status: 'CookieBar.functional.cookies.scriptDemo.status',
    PrivacyPolicy: '/PrivacyPolicy',
    Lifespan: 'Session',
    script: ['https://example.com'],
  },
],
```

### Internal scripts

A common use case is to load additional scripts depending on the user's consent. To set up which scripts are loaded for which cookie, edit `cookie.config.ts` and `cookie-scripts.config.ts`.

In `cookie.config.ts`, add the `script` property to the cookie. The property accepts an array of strings. The strings serve as identifiers for functions in `cookie-scripts.config.ts`. The implementation of the function in the scripts configuration determines what happens when the user accepts the cookie.

```ts
// cookie.config.ts

cookies: [
  {
    name: 'CookieBar.functional.cookies.scriptDemo.name',
    Provider: 'CookieBar.functional.cookies.scriptDemo.provider',
    Status: 'CookieBar.functional.cookies.scriptDemo.status',
    PrivacyPolicy: '/PrivacyPolicy',
    Lifespan: 'Session',
    script: ['loadExampleScript'],
  },
],
```

```ts
// cookie-scripts.config.ts

loadExampleScript: () => {
  console.log('Hello World!')
},
```

## Read and react to a registered cookie

Refer to the [Cookie Consent System](/guide/modules/shop-core/cookie-consent) for a more detailed overview of its features and example implementation.
