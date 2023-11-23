
# General CookieBar Information

1. Cookies are set from the **cookie.config.ts** file.
2. CookieBar is visible on the initial load of the website.
3. For a better user experience, the page is not reloaded the first time a user selects the consent. Any interaction with the CookieBar action buttons after that will result in page reload.
4. The consent in the browser will be saved in the browser cookies section in the format:

**Name: consent-cookie**
**Value**:
```
{
  "Group1:": {
    "Children1": true,
    "Children2": false
  },
  "Group2:": {
    "Children1": false,
    "Children2": false
  }
}
```

# Importing external scripts.

1. In the cookie.config.ts file we can set the **script** attribute for any cookie. This attribute will take an array of strings.
   **example**:  `script: ['https://www.plentymarkets.com']`.
2. On every interaction with the CookieBar action buttons, this script attribute will compute again and only load for the cookies that have accepted consent.
3. If an element of the array does not start with **http** then it will treat it as a javascript script that needs to be evaluated.
   **example**: `script: ['console.log("Loaded cookie script example1")']`

# Using cookie consent

For the first interaction of the user with the consent bar, because we are not reloading the page, we need to watch for the change in consent and initialise the scripts. For the subsequent interactions, we will check for consent on page load.
**The script below will take care of both of these scenarios:**


```
const browserCookies = useCookie('consent-cookie');

watch(
  () => browserCookies.value,
  (cookies: any) => {
    /*
        if (cookies.Group1.Children1) {
          loadScript()
        }
    */
  },
  { immediate: true },
);
```
